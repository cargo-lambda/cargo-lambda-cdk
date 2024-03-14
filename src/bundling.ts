/* eslint-disable no-console */
import { spawnSync } from 'child_process';
import { platform } from 'node:os';
import { dirname } from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { Architecture, AssetCode, Code } from 'aws-cdk-lib/aws-lambda';
import { Manifest, getManifest } from './cargo';
import { BundlingOptions } from './types';
import { exec } from './util';

/**
 * Options for bundling
 */
export interface BundlingProps extends BundlingOptions {
  /**
   * Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly.
   *
   * This will accept either a directory path containing a `Cargo.toml` file
   * or a filepath to your `Cargo.toml` file (i.e. `path/to/Cargo.toml`).
   *
   * This will be used as the source of the volume mounted in the Docker
   * container and will be the directory where it will run `cargo lambda build` from.
   *
   */
  readonly manifestPath: string;

  /**
   * The system architecture of the lambda function
   */
  readonly architecture?: Architecture;

  /**
   * The name of the binary to build, in case that's different than the package's name.
   */
  readonly binaryName?: string;

  /**
   * Whether the code to compile is a Lambda Extension or not.
   */
  readonly lambdaExtension?: boolean;
}

interface CommandOptions {
  readonly inputDir: string;
  readonly outputDir: string;
  readonly binaryName?: string;
  readonly osPlatform: NodeJS.Platform;
  readonly architecture?: Architecture;
  readonly lambdaExtension?: boolean;
  readonly manifest: Manifest;
}

/**
 * Bundling
 */
export class Bundling implements cdk.BundlingOptions {
  public static bundle(options: BundlingProps): AssetCode {
    const projectRoot = dirname(options.manifestPath);
    const bundling = new Bundling(projectRoot, options);

    return Code.fromAsset(projectRoot, {
      assetHashType: options.assetHashType ?? cdk.AssetHashType.OUTPUT,
      assetHash: options.assetHash,
      bundling: {
        image: bundling.image,
        command: bundling.command,
        environment: bundling.environment,
        local: bundling.local,
        // Overwrite properties which are defined from the docker options.
        ...Object.fromEntries(
          Object.entries(options.dockerOptions ?? {}).filter(
            ([_, value]) => value !== undefined,
          ),
        ),
      },
    });
  }

  public static clearRunsLocallyCache(): void { // for tests
    this.runsLocally = undefined;
  }

  private static runsLocally?: boolean;

  // Core bundling options
  public readonly image: cdk.DockerImage;
  public readonly command: string[];
  public readonly environment?: { [key: string]: string };
  public readonly local?: cdk.ILocalBundling;

  constructor(readonly projectRoot: string, private readonly props: BundlingProps) {
    Bundling.runsLocally = Bundling.runsLocally
      ?? cargoLambdaVersion()
      ?? false;

    // Docker bundling
    const shouldBuildImage = props.forcedDockerBundling || !Bundling.runsLocally;

    this.image = shouldBuildImage
      ? props.dockerImage ?? cdk.DockerImage.fromRegistry('ghcr.io/cargo-lambda/cargo-lambda')
      : cdk.DockerImage.fromRegistry('dummy'); // Do not build if we don't need to

    const manifest = getManifest(props.manifestPath);

    const osPlatform = platform();
    const bundlingCommand = this.createBundlingCommand({
      osPlatform,
      manifest,
      outputDir: cdk.AssetStaging.BUNDLING_OUTPUT_DIR,
      inputDir: cdk.AssetStaging.BUNDLING_INPUT_DIR,
      binaryName: props.binaryName,
      architecture: props.architecture,
      lambdaExtension: props.lambdaExtension,
    });

    this.command = ['bash', '-c', bundlingCommand];
    this.environment = props.environment;

    //Local bundling
    if (!props.forcedDockerBundling) { // only if Docker is not forced
      const createLocalCommand = (outputDir: string) => {
        return this.createBundlingCommand({
          osPlatform,
          manifest,
          outputDir,
          inputDir: projectRoot,
          binaryName: props.binaryName,
          architecture: props.architecture,
          lambdaExtension: props.lambdaExtension,
        });
      };

      this.local = {
        tryBundle(outputDir: string) {
          if (Bundling.runsLocally == false) {
            process.stderr.write('Rust build cannot run locally. Switching to Docker bundling.\n');
            return false;
          }

          const localCommand = createLocalCommand(outputDir);
          exec(
            osPlatform === 'win32' ? 'cmd' : 'bash',
            [
              osPlatform === 'win32' ? '/c' : '-c',
              localCommand,
            ],
            {
              env: { ...process.env, ...props.environment ?? {} },
              stdio: [ // show output
                'ignore', // ignore stdio
                process.stderr, // redirect stdout to stderr
                'inherit', // inherit stderr
              ],
              cwd: projectRoot,
              windowsVerbatimArguments: osPlatform === 'win32',
            },
          );
          return true;
        },
      };
    }
  }

  public createBundlingCommand(props: CommandOptions): string {
    const buildBinary: string[] = [
      'cargo',
      'lambda',
      'build',
      '--release',
      '--lambda-dir',
      props.outputDir,
    ];

    if (props.lambdaExtension) {
      buildBinary.push('--extension');
    }

    if (props.architecture) {
      const targetFlag = props.architecture.name == Architecture.ARM_64.name ? '--arm64' : '--x86-64';
      buildBinary.push(targetFlag);
    }

    let packageName;
    if (props.binaryName) {
      buildBinary.push('--bin');
      buildBinary.push(props.binaryName);
      packageName = props.binaryName;
    } else {
      if (props.manifest.workspace) {
        throw new Error('the Cargo manifest is a workspace, use the option `binaryName` to specify the binary to build');
      }

      packageName = props.manifest.package?.name;
      if (props.manifest.bin) {
        if (props.manifest.bin.length == 1) {
          packageName = props.manifest.bin[0].name;

          buildBinary.push('--bin');
          buildBinary.push(packageName);
        } else {
          throw new Error('there are more than one binaries declared in this Cargo package, use the option `binaryName` to specify the binary to build');
        }
      }

      if (!packageName) {
        throw new Error('the Cargo package is missing the package name or a [[bin]] section, use the option `binaryName` to specify the binary to build');
      }
    }

    if (!props.lambdaExtension && packageName) {
      buildBinary.push('--flatten');
      buildBinary.push(packageName);
    }

    const command = buildBinary.join(' ');

    return chain([
      ...this.props.commandHooks?.beforeBundling(props.inputDir, props.outputDir) ?? [],
      command,
      ...this.props.commandHooks?.afterBundling(props.inputDir, props.outputDir) ?? [],
    ]);
  }
}

function chain(commands: string[]): string {
  return commands.filter(c => !!c).join(' && ');
}

export function cargoLambdaVersion(): boolean | undefined {
  try {
    const cargo = spawnSync('cargo', ['lambda', '--version']);
    return cargo.status !== 0 || cargo.error ? undefined : true;
  } catch (err) {
    return undefined;
  }
}
