import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Bundling } from './bundling';
import { getCargoManifestPath } from './cargo';
import { BundlingOptions } from './types';

export { cargoLambdaVersion } from './bundling';

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

function bundlingOptionsFromRustFunctionProps(
  props?: RustFunctionProps,
): BundlingOptions {
  const bundling = props?.bundling ?? {};
  return {
    ...bundling,
  };
}

/**
 * A Rust Lambda function
 */
export class RustFunction extends lambda.Function {
  constructor(scope: Construct, packageName: string, props?: RustFunctionProps) {
    const manifestPath = getCargoManifestPath(props?.manifestPath ?? 'Cargo.toml');

    const runtime = lambda.Runtime.PROVIDED_AL2;
    const bundling = bundlingOptionsFromRustFunctionProps(props);

    super(scope, packageName, {
      ...props,
      runtime,
      code: Bundling.bundle({
        ...bundling,
        packageName,
        manifestPath,
        binaryName: props?.binaryName,
      }),
      handler: 'bootstrap',
    });
  }
}

