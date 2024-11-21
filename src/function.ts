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
   * The name of the binary to build, in case that's different than the package's name.
   */
  readonly binaryName?: string;

  /**
   * The Lambda runtime to deploy this function.
   * `provided.al2023` is the default runtime when this option is not provided.
   */
  readonly runtime?: 'provided.al2023' | 'provided.al2';

  /**
   * Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly.
   *
   * This will accept a directory path containing a `Cargo.toml` file, a filepath to your
   * `Cargo.toml` file (i.e. `path/to/Cargo.toml`), or a git repository url
   * (e.g. `https://github.com/your_user/your_repo`).
   *
   * When using a git repository URL, the repository will be cloned to a temporary directory.
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

  /**
   * The branch to clone if the `manifestPath` is a git repository.
   *
   * @default - the default branch, i.e. HEAD.
   */
  readonly branch?: string;

  /**
   * Always clone the repository if using a git `manifestPath`, even if it has already been
   * cloned to the temporary directory.
   *
   * @default - clones only if the repository and branch does not already exist in the
   * temporary directory.
   */
  readonly alwaysClone?: boolean;
}

/**
 * A Rust Lambda function
 */
export class RustFunction extends Function {
  constructor(scope: Construct, resourceName: string, props?: RustFunctionProps) {
    const manifestPath = getManifestPath(props?.manifestPath ?? 'Cargo.toml', props?.branch, props?.alwaysClone);

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
