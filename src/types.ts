import { AssetHashType, DockerImage } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { Architecture } from 'aws-cdk-lib/aws-lambda';

/**
 * Bundling options
 */
export interface BundlingOptions {
  /**
   * Environment variables defined when Cargo runs.
   *
   * @default - no environment variables are defined.
   */
  readonly environment?: { [key: string]: string };

  /**
   * Force bundling in a Docker container even if local bundling is
   * possible.
   *
   * @default - false
   */
  readonly forcedDockerBundling?: boolean;

  /**
   * A custom bundling Docker image.
   *
   * @default - use the Docker image provided by calavera/cargo-lambda:latest
   */
  readonly dockerImage?: DockerImage;

  /**
   * Additional options when using docker bundling. This option can override the
   * `command`, `environment` and `local` options are normally specified by the
   * `RustFunction`.
   *
   * @default - the same defaults as specified by `cdk.BundlingOptions`.
   */
  readonly dockerOptions?: Omit<cdk.BundlingOptions, 'image'>;

  /**
   * Determines how the asset hash is calculated. Assets will
   * get rebuilt and uploaded only if their hash has changed.
   *
   * @default - AssetHashType.OUTPUT. If `assetHash` is also specified,
   * the default is `CUSTOM`.
   */
  readonly assetHashType?: AssetHashType;

  /**
   * Specify a custom hash for this asset. If `assetHashType` is set it must
   * be set to `AssetHashType.CUSTOM`. For consistency, this custom hash will
   * be SHA256 hashed and encoded as hex. The resulting hash will be the asset
   * hash.
   *
   * NOTE: the hash is used in order to identify a specific revision of the asset, and
   * used for optimizing and caching deployment activities related to this asset such as
   * packaging, uploading to Amazon S3, etc. If you chose to customize the hash, you will
   * need to make sure it is updated every time the asset changes, or otherwise it is
   * possible that some deployments will not be invalidated.
   *
   * @default - based on `assetHashType`
   */
  readonly assetHash?: string;

  /**
   * Command hooks
   *
   * @default - do not run additional commands
   */
  readonly commandHooks?: ICommandHooks;

  /**
   * The system architecture of the lambda function
   *
   * @default - X86_64
   */
  readonly architecture?: Architecture;
}

/**
 * Command hooks
 *
 * These commands will run in the environment in which bundling occurs: inside
 * the container for Docker bundling or on the host OS for local bundling.
 *
 * Commands are chained with `&&`.
 *
 * ```text
 * {
 *   // Run tests prior to bundling
 *   beforeBundling(inputDir: string, outputDir: string): string[] {
 *     return [`cargo test`];
 *   }
 *   // ...
 * }
 * ```
 */
export interface ICommandHooks {
  /**
   * Returns commands to run before bundling.
   *
   * Commands are chained with `&&`.
   */
  beforeBundling(inputDir: string, outputDir: string): string[];

  /**
   * Returns commands to run after bundling.
   *
   * Commands are chained with `&&`.
   */
  afterBundling(inputDir: string, outputDir: string): string[];
}
