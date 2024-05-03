import { AssetHashType, DockerImage } from 'aws-cdk-lib';
import { Architecture } from 'aws-cdk-lib/aws-lambda';
import {
  BundlingFileAccess,
  BundlingOutput,
  DockerVolume,
  ILocalBundling,
} from 'aws-cdk-lib/core/lib/bundling';

/**
 * Additional docker options when using docker bundling. Default values here inherit
 * from `cdk.BundlingOptions`.
 */
export interface DockerOptions {
  /**
   * The entrypoint to run in the Docker container.
   *
   * @see https://docs.docker.com/engine/reference/builder/#entrypoint
   *
   * @default - run the entrypoint defined in the image
   */
  readonly entrypoint?: string[];

  /**
   * The command to run in the Docker container. This is normally controlled by the `RustFunction`
   * but can be overridden here.
   *
   * @default - a cargo lambda compilation
   */
  readonly command?: string[];

  /**
   * Additional Docker volumes to mount.
   *
   * @default - no additional volumes are mounted
   */
  readonly volumes?: DockerVolume[];

  /**
   * Where to mount the specified volumes from.
   *
   * @see https://docs.docker.com/engine/reference/commandline/run/#mount-volumes-from-container---volumes-from
   *
   * @default - no containers are specified to mount volumes from
   */
  readonly volumesFrom?: string[];

  /**
   * Working directory inside the Docker container.
   *
   * @default /asset-input
   */
  readonly workingDirectory?: string;

  /**
   * The user to use when running the Docker container.
   *
   *   user | user:group | uid | uid:gid | user:gid | uid:group
   *
   * @see https://docs.docker.com/engine/reference/run/#user
   *
   * @default - uid:gid of the current user or 1000:1000 on Windows
   */
  readonly user?: string;

  /**
   * Local bundling provider. This is normally controlled by the `RustFunction`
   * but can be overridden here.
   *
   * @default - bundling will be performed locally if Rust and cargo-lambda are
   * installed and `forcedDockerBundling` is not true, otherwise it will be performed
   * in the docker container
   */
  readonly local?: ILocalBundling;

  /**
   * The type of output that this bundling operation is producing.
   *
   * @default BundlingOutput.AUTO_DISCOVER
   */
  readonly outputType?: BundlingOutput;

  /**
   * [Security configuration](https://docs.docker.com/engine/reference/run/#security-configuration)
   * when running the docker container.
   *
   * @default - no security options
   */
  readonly securityOpt?: string;

  /**
   * Docker [Networking options](https://docs.docker.com/engine/reference/commandline/run/#connect-a-container-to-a-network---network)
   *
   * @default - no networking options
   */
  readonly network?: string;

  /**
   * The access mechanism used to make source files available to the bundling container and to return the bundling
   * output back to the host.
   *
   * @default - BundlingFileAccess.BIND_MOUNT
   */
  readonly bundlingFileAccess?: BundlingFileAccess;
}

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
   * Additional options when using docker bundling.
   *
   * @default - the same defaults as specified by `cdk.BundlingOptions`
   */
  readonly dockerOptions?: DockerOptions;

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

  /**
   * Additional list of flags to pass to `cargo lambda build`.
   */
  readonly cargoLambdaFlags?: string[];
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
