import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Bundling } from './bundling';
import { getCargoManifestPath } from './cargo';
import { BundlingOptions } from './types';


export interface RustExtensionProps extends lambda.LayerVersionOptions {
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
 * A Lambda extension written in Rust
 */
export class RustExtension extends lambda.LayerVersion {
  constructor(scope: Construct, packageName: string, props?: RustExtensionProps) {
    const manifestPath = getCargoManifestPath(props?.manifestPath ?? 'Cargo.toml');
    const bundling = props?.bundling ?? {};

    super(scope, packageName, {
      ...props,
      code: Bundling.bundle({
        ...bundling,
        packageName,
        manifestPath,
        binaryName: props?.binaryName,
        lambdaExtension: true,
      }),
    });
  }
}