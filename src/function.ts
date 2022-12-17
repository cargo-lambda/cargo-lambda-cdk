import * as fs from 'fs';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Bundling } from './bundling';
import { BundlingOptions } from './types';

/**
 * Properties for a RustFunction
 */
export interface RustFunctionProps extends lambda.FunctionOptions {
  /**
   * The name of the binary to build, in case that's different than the package's name.
   */
  readonly binaryName?: string;

  /**
   * Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly.
   *
   * This will accept either a directory path containing a `Cargo.toml` file
   * or a filepath to your `Cargo.toml` file (i.e. `path/to/Cargo.toml`).
   *
   * @default - check the current directory for a `Cargo.toml` file, and throws
   *  an error if the file doesn't exist.
   */
  readonly manifestPath?: string;

  /**
   * Bundling options
   *
   * @default - use default bundling options
   */
  readonly bundling?: BundlingOptions;
}

/**
 * A Rust Lambda function
 */
export class RustFunction extends lambda.Function {
  constructor(scope: Construct, packageName: string, props?: RustFunctionProps) {
    // Find the package root
    props = props ?? {};
    const manifestPathProp = props.manifestPath ?? 'Cargo.toml';
    const parsedManifestPath = path.parse(manifestPathProp);
    let manifestPath: string;

    if (parsedManifestPath.base && parsedManifestPath.ext && parsedManifestPath.base === 'Cargo.toml') {
      if (!fs.existsSync(manifestPathProp)) {
        throw new Error('Cargo.toml doesn\'t exist');
      }
      manifestPath = manifestPathProp;
    } else if (parsedManifestPath.base && parsedManifestPath.ext && parsedManifestPath.base != 'Cargo.toml') {
      throw new Error('manifestPath is specifying a file that is not Cargo.toml');
    } else if (!fs.existsSync(path.join(manifestPathProp, 'Cargo.toml'))) {
      throw new Error(`Cargo.toml file at ${manifestPathProp} doesn't exist`);
    } else {
      manifestPath = path.join(manifestPathProp, 'Cargo.toml');
    }

    const runtime = lambda.Runtime.PROVIDED_AL2;
    const bundling = props.bundling ?? {};

    super(scope, packageName, {
      ...props,
      runtime,
      code: Bundling.bundle({
        ...bundling,
        packageName,
        manifestPath,
        binaryName: props.binaryName,
      }),
      handler: 'bootstrap',
    });
  }
}

