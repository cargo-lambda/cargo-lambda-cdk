# Cargo Lambda CDK construct

This library provides constructs for Rust Lambda functions built with Cargo Lambda

To use this module you will either need to have [Cargo Lambda installed](https://www.cargo-lambda.info/guide/installation.html) (`0.12.0` or later), or `Docker` installed.
See [Local Bundling](#local-bundling)/[Docker Bundling](#docker-bundling) for more information.

## Installation

### JavaScript / TypeScript

You can add [the npm package](https://npmjs.com/package/cargo-lambda-cdk) to your program as follows,

```bash
npm i cargo-lambda-cdk
```

Or using any other compatible package manager

### Go

Add the following to your imports,

```plain
github.com/cargo-lambda/cargo-lambda-cdk/cargolambdacdk
```

### Python

You can add [the Python package](https://pypi.org/project/cargo-lambda-cdk) using `pip`, or any other package manager compatible with PyPI,

```bash
pip install cargo-lambda-cdk
```

## Rust Function

Define a `RustFunction`:

```go
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(stack, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
});
```

The layout for this Rust project could look like this:

```bash
lambda-project
├── Cargo.toml
└── src
    └── main.rs
```

### Runtime

The `RustFunction` uses the `provided.al2023` runtime. If you want to change it, you can use the property `runtime`. The only other valid option is `provided.al2`:

```go
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(stack, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  runtime: 'provided.al2',
});
```

## Rust Extension

Define a `RustExtension` that get's deployed as a layer to use it with any other function later.

```go
import { RustExtension, RustFunction } from 'cargo-lambda-cdk';
import { Architecture } from 'aws-cdk-lib/aws-lambda';

const extensionLayer = new RustExtension(this, 'Rust extension', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  architecture: Architecture.ARM_64,
});

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  layers: [
    extensionLayer
  ],
});
```

## Remote Git sources

Both `RustFunction` and `RustExtension` support cloning a git repository to get the source code for the function or extension.
To download the source code from a remote git repository, specify the `gitRemote`. This option can be a valid git remote url, such as `https://github.com/your_user/your_repo`, or a valid ssh url, such as `git@github.com:your_user/your_repo.git`.

By default, the latest commit from the `HEAD` branch will be downloaded. To download a different git reference, specify the `gitReference` option. This can be a branch name, tag, or commit hash.

If you want to always clone the repository even if it has already been cloned to the temporary directory, set the `gitForceClone` option to `true`.

If you specify a `manifestPath`, it will be relative to the root of the git repository once it has been cloned.

```go
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(stack, 'Rust function', {
  gitRemote: 'https://github.com/your_user/your_repo',
  gitReference: 'branch',
  gitForceClone: true,
});
```

## Bundling

Bundling is the process by which `cargo lambda` gets called to build, package, and deliver the Rust
binary for CDK. This construct provides two methods of bundling:

* Local bundling where the locally installed cargo lambda tool will run
* Docker bundling where a Dockerfile can be specified to build an image

### Local Bundling

If `Cargo Lambda` is installed locally then it will be used to bundle your code in your environment. Otherwise, bundling will happen in a Lambda compatible Docker container with the Docker platform based on the target architecture of the Lambda function.

### Environment

Use the `environment` prop to define additional environment variables when Cargo Lambda runs:

```go
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  bundling: {
    environment: {
      HELLO: 'WORLD',
    },
  },
});
```

### Cargo Build profiles

Use the `profile` option if you want to build with a different Cargo profile that's not `release`:

```go
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  bundling: {
    profile: 'dev'
  },
});
```

### Cargo Lambda Build flags

Use the `cargoLambdaFlags` option to add additional flags to the `cargo lambda build` command that's executed to bundle your function. You don't need to use this flag to set options like the target architecture or the binary to compile, since the construct infers those from other props.

If these flags include a `--target` flag, it will override the `architecture` option. If these flags include a `--release` or `--profile` flag, it will override the release or any other profile specified.

```go
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  bundling: {
    cargoLambdaFlags: [
      '--target',
      'x86_64-unknown-linux-musl',
      '--debug',
      '--disable-optimizations',
    ],
  },
});
```

### Docker

To force bundling in a docker container even if `Cargo Lambda` is available in your environment, set the `forcedDockerBundling` prop to `true`. This is useful if you want to make sure that your function is built in a consistent Lambda compatible environment.

By default, these constructs use [ghcr.io/cargo-lambda/cargo-lambda](https://github.com/cargo-lambda/cargo-lambda/pkgs/container/cargo-lambda) as the image to build with. Use the `bundling.dockerImage` prop to use a custom bundling image:

```go
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  bundling: {
    dockerImage: DockerImage.fromBuild('/path/to/Dockerfile'),
  },
});
```

Additional docker options such as the user, file access, working directory or volumes can be configured by using the `bundling.dockerOptions` prop:

```go
import * as cdk from 'aws-cdk-lib';
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  bundling: {
    dockerOptions: {
      bundlingFileAccess: cdk.BundlingFileAccess.VOLUME_COPY,
    },
  },
});
```

This property mirrors values from the `cdk.BundlingOptions` and is passed into `Code.fromAsset`.

If you want to use a custom Docker image, you can use the `bundling.dockerImage` prop:

```go
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  bundling: {
    dockerImage: DockerImage.fromRegistry('your_docker_image'),
  },
});
```

If you want to mount additional volumes to the Docker container, you can use the `dockerOptions.volumes` prop. This is useful if you want to mount Cargo's cache directory to speed up the build process. The `CARGO_HOME` in the default image is `/usr/local/cargo`.

```go
import { RustFunction } from 'cargo-lambda-cdk';
import { homedir } from 'os';
import { join } from 'path';

const cargoHome = process.env.CARGO_HOME || join(homedir(), '.cargo');

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  bundling: {
    dockerOptions: {
      volumes: [{
        hostPath: join(cargoHome, 'registry'),
        containerPath: '/usr/local/cargo/registry',
      },
      {
        hostPath: join(cargoHome, 'git'),
        containerPath: '/usr/local/cargo/git',
      }],
    },
  },
});
```

### Command hooks

It is  possible to run additional commands by specifying the `commandHooks` prop:

```go
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  bundling: {
    commandHooks: {
      // run tests
      beforeBundling(inputDir: string, _outputDir: string): string[] {
        return ['cargo test'];
      },
    },
  },
});
```

The following hooks are available:

* `beforeBundling`: runs before all bundling commands
* `afterBundling`: runs after all bundling commands

They all receive the directory containing the `Cargo.toml` file (`inputDir`) and the
directory where the bundled asset will be output (`outputDir`). They must return
an array of commands to run. Commands are chained with `&&`.

The commands will run in the environment in which bundling occurs: inside the
container for Docker bundling or on the host OS for local bundling.

## Additional considerations

Depending on how you structure your Rust application, you may want to change the `assetHashType` parameter.
By default this parameter is set to `AssetHashType.OUTPUT` which means that the CDK will calculate the asset hash
(and determine whether or not your code has changed) based on the Rust executable that is created.

If you specify `AssetHashType.SOURCE`, the CDK will calculate the asset hash by looking at the folder
that contains your `Cargo.toml` file. If you are deploying a single Lambda function, or you want to redeploy
all of your functions if anything changes, then `AssetHashType.SOURCE` will probaby work.

## LICENSE

This software is released under MIT license.
