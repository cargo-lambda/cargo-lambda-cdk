import { Function, FunctionOptions, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Bundling } from './bundling';
import { getManifestPath } from './cargo';
import { BundlingOptions } from './types';
import { bundlingOptionsFromRustFunctionProps } from './util';

export { cargoLambdaVersion } from './bundling';

/**
 * Properties for a RustFunction
 */
export interface RustFunctionProps extends FunctionOptions {
  /**
   * The Lambda runtime to deploy this function.
   * `provided.al2023` is the default runtime when this option is not provided.
   */
  readonly runtime?: 'provided.al2023' | 'provided.al2';

  /**
  * Bundling options
 *
 * @default - use default bundling options
 */
  readonly bundling?: BundlingOptions;

  /**
   * The name of the binary to build, in case that's different than the package's name.
   */
  readonly binaryName?: string;

  /**
   * Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly.
   *
   * This will accept a directory path containing a `Cargo.toml` file (i.e. `path/to/package`), or a filepath to your
   * `Cargo.toml` file (i.e. `path/to/Cargo.toml`). When the `gitRemote` option is provided,
   * the `manifestPath` is relative to the root of the git repository.
   *
   * @default - check the current directory for a `Cargo.toml` file, and throws
   *  an error if the file doesn't exist.
   */
  readonly manifestPath?: string;

  /**
   * The git remote URL to clone (e.g `https://github.com/your_user/your_repo`).
   *
   * This repository will be cloned to a temporary directory using `git`.
   * The `git` command must be available in the PATH.
   */
  readonly gitRemote?: string;

  /**
   * The git reference to checkout. This can be a branch, tag, or commit hash.
   *
   * If this option is not provided, `git clone` will run with the flag `--depth 1`.
   *
   * @default - the default branch, i.e. HEAD.
   */
  readonly gitReference?: string;

  /**
   * Always clone the repository if using the `gitRemote` option, even if it has already been
   * cloned to the temporary directory.
   *
   * @default - clones only if the repository and reference don't already exist in the
   * temporary directory.
   */
  readonly gitForceClone?: boolean;
}

/**
 * A Rust Lambda function
 */
export class RustFunction extends Function {
  constructor(scope: Construct, resourceName: string, props?: RustFunctionProps) {
    const manifestPath = getManifestPath(props || {});

    const runtime = new Runtime(props?.runtime || 'provided.al2023');
    const bundling = bundlingOptionsFromRustFunctionProps(props);

    super(scope, resourceName, {
      ...props,
      runtime,
      architecture: bundling.architecture,
      code: Bundling.bundle({
        ...bundling,
        manifestPath,
        binaryName: props?.binaryName,
      }),
      handler: 'bootstrap',
    });
  }
}
