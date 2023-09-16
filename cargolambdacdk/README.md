# Cargo Lambda CDK construct

This library provides constructs for Rust Lambda functions built with Cargo Lambda

To use this module you will either need to have [Cargo Lambda installed](https://www.cargo-lambda.info/guide/installation.html) (`0.12.0` or later), or `Docker` installed.
See [Local Bundling](#local-bundling)/[Docker Bundling](#docker-bundling) for more information.

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

The `RustFunction` uses the `PROVIDED_AL2` runtime.

## Rust Extension

Define a `RustExtension` that get's deployed as a layer to use it with any other function later.

```go
import { RustExtension, RustFunction } from 'cargo-lambda-cdk';

const extensionLayer = new RustExtension(this, 'Rust extension', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
});

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  layers: [
    extensionLayer
  ],
});
```

## Environment

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

## Local Bundling

If `Cargo Lambda` is installed locally then it will be used to bundle your code in your environment. Otherwise, bundling will happen in a Lambda compatible Docker container with the Docker platform based on the target architecture of the Lambda function.

## Docker

To force bundling in a docker container even if `Cargo Lambda` is available in your environment, set the `forceDockerBundling` prop to `true`. This is useful if you want to make sure that your function is built in a consistent Lambda compatible environment.

Use the `bundling.dockerImage` prop to use a custom bundling image:

```go
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  bundling: {
    dockerImage: DockerImage.fromBuild('/path/to/Dockerfile'),
  },
});
```

## Command hooks

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
