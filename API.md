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

```ts
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

Note that `manifestPath` can be a remote git repository which will be cloned for you, i.e:

```ts
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(stack, 'Rust function', {
  // Specify the branch to clone, defaults to HEAD.
  branch: 'branch',
  manifestPath: 'https://github.com/your_user/your_repo',
  // Other flavors of git urls should work ☝️ too:
  //
  // https://github.com/user/repo.git
  // ssh://user@host:22/user/repo.git
  // git@github.com:user/repo.git
});
```

### Runtime

The `RustFunction` uses the `provided.al2023` runtime. If you want to change it, you can use the property `runtime`. The only other valid option is `provided.al2`:

```ts
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(stack, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  runtime: 'provided.al2',
});
```

## Rust Extension

Define a `RustExtension` that get's deployed as a layer to use it with any other function later.

```ts
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
## Bundling

Bundling is the process by which `cargo lambda` gets called to build, package, and deliver the Rust
binary for CDK. This construct provides two methods of bundling:
 - Local bundling where the locally installed cargo lambda tool will run
 - Docker bundling where a Dockerfile can be specified to build an image

### Local Bundling

If `Cargo Lambda` is installed locally then it will be used to bundle your code in your environment. Otherwise, bundling will happen in a Lambda compatible Docker container with the Docker platform based on the target architecture of the Lambda function.

### Environment

Use the `environment` prop to define additional environment variables when Cargo Lambda runs:

```ts
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

```ts
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

```ts
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

By default, these constructs use `ghcr.io/cargo-lambda/cargo-lambda` as the image to build with. Use the `bundling.dockerImage` prop to use a custom bundling image:

```ts
import { RustFunction } from 'cargo-lambda-cdk';

new RustFunction(this, 'Rust function', {
  manifestPath: 'path/to/package/directory/with/Cargo.toml',
  bundling: {
    dockerImage: DockerImage.fromBuild('/path/to/Dockerfile'),
  },
});
```

Additional docker options such as the user, file access, working directory or volumes can be configured by using the `bundling.dockerOptions` prop:

```ts
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

### Command hooks

It is  possible to run additional commands by specifying the `commandHooks` prop:

```ts
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

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### RustExtension <a name="RustExtension" id="cargo-lambda-cdk.RustExtension"></a>

A Lambda extension written in Rust.

#### Initializers <a name="Initializers" id="cargo-lambda-cdk.RustExtension.Initializer"></a>

```typescript
import { RustExtension } from 'cargo-lambda-cdk'

new RustExtension(scope: Construct, resourceName: string, props?: RustExtensionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cargo-lambda-cdk.RustExtension.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cargo-lambda-cdk.RustExtension.Initializer.parameter.resourceName">resourceName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cargo-lambda-cdk.RustExtension.Initializer.parameter.props">props</a></code> | <code><a href="#cargo-lambda-cdk.RustExtensionProps">RustExtensionProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cargo-lambda-cdk.RustExtension.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `resourceName`<sup>Required</sup> <a name="resourceName" id="cargo-lambda-cdk.RustExtension.Initializer.parameter.resourceName"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustExtension.Initializer.parameter.props"></a>

- *Type:* <a href="#cargo-lambda-cdk.RustExtensionProps">RustExtensionProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cargo-lambda-cdk.RustExtension.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cargo-lambda-cdk.RustExtension.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cargo-lambda-cdk.RustExtension.addPermission">addPermission</a></code> | Add permission for this layer version to specific entities. |

---

##### `toString` <a name="toString" id="cargo-lambda-cdk.RustExtension.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cargo-lambda-cdk.RustExtension.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cargo-lambda-cdk.RustExtension.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addPermission` <a name="addPermission" id="cargo-lambda-cdk.RustExtension.addPermission"></a>

```typescript
public addPermission(id: string, permission: LayerVersionPermission): void
```

Add permission for this layer version to specific entities.

Usage within
the same account where the layer is defined is always allowed and does not
require calling this method. Note that the principal that creates the
Lambda function using the layer (for example, a CloudFormation changeset
execution role) also needs to have the ``lambda:GetLayerVersion``
permission on the layer version.

###### `id`<sup>Required</sup> <a name="id" id="cargo-lambda-cdk.RustExtension.addPermission.parameter.id"></a>

- *Type:* string

---

###### `permission`<sup>Required</sup> <a name="permission" id="cargo-lambda-cdk.RustExtension.addPermission.parameter.permission"></a>

- *Type:* aws-cdk-lib.aws_lambda.LayerVersionPermission

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cargo-lambda-cdk.RustExtension.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cargo-lambda-cdk.RustExtension.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cargo-lambda-cdk.RustExtension.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#cargo-lambda-cdk.RustExtension.fromLayerVersionArn">fromLayerVersionArn</a></code> | Imports a layer version by ARN. |
| <code><a href="#cargo-lambda-cdk.RustExtension.fromLayerVersionAttributes">fromLayerVersionAttributes</a></code> | Imports a Layer that has been defined externally. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cargo-lambda-cdk.RustExtension.isConstruct"></a>

```typescript
import { RustExtension } from 'cargo-lambda-cdk'

RustExtension.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cargo-lambda-cdk.RustExtension.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cargo-lambda-cdk.RustExtension.isOwnedResource"></a>

```typescript
import { RustExtension } from 'cargo-lambda-cdk'

RustExtension.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cargo-lambda-cdk.RustExtension.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cargo-lambda-cdk.RustExtension.isResource"></a>

```typescript
import { RustExtension } from 'cargo-lambda-cdk'

RustExtension.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cargo-lambda-cdk.RustExtension.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromLayerVersionArn` <a name="fromLayerVersionArn" id="cargo-lambda-cdk.RustExtension.fromLayerVersionArn"></a>

```typescript
import { RustExtension } from 'cargo-lambda-cdk'

RustExtension.fromLayerVersionArn(scope: Construct, id: string, layerVersionArn: string)
```

Imports a layer version by ARN.

Assumes it is compatible with all Lambda runtimes.

###### `scope`<sup>Required</sup> <a name="scope" id="cargo-lambda-cdk.RustExtension.fromLayerVersionArn.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="cargo-lambda-cdk.RustExtension.fromLayerVersionArn.parameter.id"></a>

- *Type:* string

---

###### `layerVersionArn`<sup>Required</sup> <a name="layerVersionArn" id="cargo-lambda-cdk.RustExtension.fromLayerVersionArn.parameter.layerVersionArn"></a>

- *Type:* string

---

##### `fromLayerVersionAttributes` <a name="fromLayerVersionAttributes" id="cargo-lambda-cdk.RustExtension.fromLayerVersionAttributes"></a>

```typescript
import { RustExtension } from 'cargo-lambda-cdk'

RustExtension.fromLayerVersionAttributes(scope: Construct, id: string, attrs: LayerVersionAttributes)
```

Imports a Layer that has been defined externally.

###### `scope`<sup>Required</sup> <a name="scope" id="cargo-lambda-cdk.RustExtension.fromLayerVersionAttributes.parameter.scope"></a>

- *Type:* constructs.Construct

the parent Construct that will use the imported layer.

---

###### `id`<sup>Required</sup> <a name="id" id="cargo-lambda-cdk.RustExtension.fromLayerVersionAttributes.parameter.id"></a>

- *Type:* string

the id of the imported layer in the construct tree.

---

###### `attrs`<sup>Required</sup> <a name="attrs" id="cargo-lambda-cdk.RustExtension.fromLayerVersionAttributes.parameter.attrs"></a>

- *Type:* aws-cdk-lib.aws_lambda.LayerVersionAttributes

the properties of the imported layer.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cargo-lambda-cdk.RustExtension.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cargo-lambda-cdk.RustExtension.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cargo-lambda-cdk.RustExtension.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cargo-lambda-cdk.RustExtension.property.layerVersionArn">layerVersionArn</a></code> | <code>string</code> | The ARN of the Lambda Layer version that this Layer defines. |
| <code><a href="#cargo-lambda-cdk.RustExtension.property.compatibleRuntimes">compatibleRuntimes</a></code> | <code>aws-cdk-lib.aws_lambda.Runtime[]</code> | The runtimes compatible with this Layer. |

---

##### `node`<sup>Required</sup> <a name="node" id="cargo-lambda-cdk.RustExtension.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cargo-lambda-cdk.RustExtension.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cargo-lambda-cdk.RustExtension.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `layerVersionArn`<sup>Required</sup> <a name="layerVersionArn" id="cargo-lambda-cdk.RustExtension.property.layerVersionArn"></a>

```typescript
public readonly layerVersionArn: string;
```

- *Type:* string

The ARN of the Lambda Layer version that this Layer defines.

---

##### `compatibleRuntimes`<sup>Optional</sup> <a name="compatibleRuntimes" id="cargo-lambda-cdk.RustExtension.property.compatibleRuntimes"></a>

```typescript
public readonly compatibleRuntimes: Runtime[];
```

- *Type:* aws-cdk-lib.aws_lambda.Runtime[]

The runtimes compatible with this Layer.

---


### RustFunction <a name="RustFunction" id="cargo-lambda-cdk.RustFunction"></a>

A Rust Lambda function.

#### Initializers <a name="Initializers" id="cargo-lambda-cdk.RustFunction.Initializer"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

new RustFunction(scope: Construct, resourceName: string, props?: RustFunctionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cargo-lambda-cdk.RustFunction.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cargo-lambda-cdk.RustFunction.Initializer.parameter.resourceName">resourceName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cargo-lambda-cdk.RustFunction.Initializer.parameter.props">props</a></code> | <code><a href="#cargo-lambda-cdk.RustFunctionProps">RustFunctionProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cargo-lambda-cdk.RustFunction.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `resourceName`<sup>Required</sup> <a name="resourceName" id="cargo-lambda-cdk.RustFunction.Initializer.parameter.resourceName"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.Initializer.parameter.props"></a>

- *Type:* <a href="#cargo-lambda-cdk.RustFunctionProps">RustFunctionProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cargo-lambda-cdk.RustFunction.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cargo-lambda-cdk.RustFunction.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addEventSource">addEventSource</a></code> | Adds an event source to this function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addEventSourceMapping">addEventSourceMapping</a></code> | Adds an event source that maps to this AWS Lambda function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addFunctionUrl">addFunctionUrl</a></code> | Adds a url to this lambda function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addPermission">addPermission</a></code> | Adds a permission to the Lambda resource policy. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addToRolePolicy">addToRolePolicy</a></code> | Adds a statement to the IAM role assumed by the instance. |
| <code><a href="#cargo-lambda-cdk.RustFunction.configureAsyncInvoke">configureAsyncInvoke</a></code> | Configures options for asynchronous invocation. |
| <code><a href="#cargo-lambda-cdk.RustFunction.considerWarningOnInvokeFunctionPermissions">considerWarningOnInvokeFunctionPermissions</a></code> | A warning will be added to functions under the following conditions: - permissions that include `lambda:InvokeFunction` are added to the unqualified function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.grantInvoke">grantInvoke</a></code> | Grant the given identity permissions to invoke this Lambda. |
| <code><a href="#cargo-lambda-cdk.RustFunction.grantInvokeUrl">grantInvokeUrl</a></code> | Grant the given identity permissions to invoke this Lambda Function URL. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metric">metric</a></code> | Return the given named metric for this Function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricDuration">metricDuration</a></code> | How long execution of this Lambda takes. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricErrors">metricErrors</a></code> | How many invocations of this Lambda fail. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricInvocations">metricInvocations</a></code> | How often this Lambda is invoked. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricThrottles">metricThrottles</a></code> | How often this Lambda is throttled. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addAlias">addAlias</a></code> | Defines an alias for this function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addEnvironment">addEnvironment</a></code> | Adds an environment variable to this Lambda function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addLayers">addLayers</a></code> | Adds one or more Lambda Layers to this Lambda function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.invalidateVersionBasedOn">invalidateVersionBasedOn</a></code> | Mix additional information into the hash of the Version object. |

---

##### `toString` <a name="toString" id="cargo-lambda-cdk.RustFunction.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cargo-lambda-cdk.RustFunction.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cargo-lambda-cdk.RustFunction.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addEventSource` <a name="addEventSource" id="cargo-lambda-cdk.RustFunction.addEventSource"></a>

```typescript
public addEventSource(source: IEventSource): void
```

Adds an event source to this function.

Event sources are implemented in the @aws-cdk/aws-lambda-event-sources module.

The following example adds an SQS Queue as an event source:
```
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
myFunction.addEventSource(new SqsEventSource(myQueue));
```

###### `source`<sup>Required</sup> <a name="source" id="cargo-lambda-cdk.RustFunction.addEventSource.parameter.source"></a>

- *Type:* aws-cdk-lib.aws_lambda.IEventSource

---

##### `addEventSourceMapping` <a name="addEventSourceMapping" id="cargo-lambda-cdk.RustFunction.addEventSourceMapping"></a>

```typescript
public addEventSourceMapping(id: string, options: EventSourceMappingOptions): EventSourceMapping
```

Adds an event source that maps to this AWS Lambda function.

###### `id`<sup>Required</sup> <a name="id" id="cargo-lambda-cdk.RustFunction.addEventSourceMapping.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="cargo-lambda-cdk.RustFunction.addEventSourceMapping.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.EventSourceMappingOptions

---

##### `addFunctionUrl` <a name="addFunctionUrl" id="cargo-lambda-cdk.RustFunction.addFunctionUrl"></a>

```typescript
public addFunctionUrl(options?: FunctionUrlOptions): FunctionUrl
```

Adds a url to this lambda function.

###### `options`<sup>Optional</sup> <a name="options" id="cargo-lambda-cdk.RustFunction.addFunctionUrl.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.FunctionUrlOptions

---

##### `addPermission` <a name="addPermission" id="cargo-lambda-cdk.RustFunction.addPermission"></a>

```typescript
public addPermission(id: string, permission: Permission): void
```

Adds a permission to the Lambda resource policy.

> [Permission for details.](Permission for details.)

###### `id`<sup>Required</sup> <a name="id" id="cargo-lambda-cdk.RustFunction.addPermission.parameter.id"></a>

- *Type:* string

The id for the permission construct.

---

###### `permission`<sup>Required</sup> <a name="permission" id="cargo-lambda-cdk.RustFunction.addPermission.parameter.permission"></a>

- *Type:* aws-cdk-lib.aws_lambda.Permission

The permission to grant to this Lambda function.

---

##### `addToRolePolicy` <a name="addToRolePolicy" id="cargo-lambda-cdk.RustFunction.addToRolePolicy"></a>

```typescript
public addToRolePolicy(statement: PolicyStatement): void
```

Adds a statement to the IAM role assumed by the instance.

###### `statement`<sup>Required</sup> <a name="statement" id="cargo-lambda-cdk.RustFunction.addToRolePolicy.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

---

##### `configureAsyncInvoke` <a name="configureAsyncInvoke" id="cargo-lambda-cdk.RustFunction.configureAsyncInvoke"></a>

```typescript
public configureAsyncInvoke(options: EventInvokeConfigOptions): void
```

Configures options for asynchronous invocation.

###### `options`<sup>Required</sup> <a name="options" id="cargo-lambda-cdk.RustFunction.configureAsyncInvoke.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.EventInvokeConfigOptions

---

##### `considerWarningOnInvokeFunctionPermissions` <a name="considerWarningOnInvokeFunctionPermissions" id="cargo-lambda-cdk.RustFunction.considerWarningOnInvokeFunctionPermissions"></a>

```typescript
public considerWarningOnInvokeFunctionPermissions(scope: Construct, action: string): void
```

A warning will be added to functions under the following conditions: - permissions that include `lambda:InvokeFunction` are added to the unqualified function.

function.currentVersion is invoked before or after the permission is created.

This applies only to permissions on Lambda functions, not versions or aliases.
This function is overridden as a noOp for QualifiedFunctionBase.

###### `scope`<sup>Required</sup> <a name="scope" id="cargo-lambda-cdk.RustFunction.considerWarningOnInvokeFunctionPermissions.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `action`<sup>Required</sup> <a name="action" id="cargo-lambda-cdk.RustFunction.considerWarningOnInvokeFunctionPermissions.parameter.action"></a>

- *Type:* string

---

##### `grantInvoke` <a name="grantInvoke" id="cargo-lambda-cdk.RustFunction.grantInvoke"></a>

```typescript
public grantInvoke(grantee: IGrantable): Grant
```

Grant the given identity permissions to invoke this Lambda.

###### `grantee`<sup>Required</sup> <a name="grantee" id="cargo-lambda-cdk.RustFunction.grantInvoke.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantInvokeUrl` <a name="grantInvokeUrl" id="cargo-lambda-cdk.RustFunction.grantInvokeUrl"></a>

```typescript
public grantInvokeUrl(grantee: IGrantable): Grant
```

Grant the given identity permissions to invoke this Lambda Function URL.

###### `grantee`<sup>Required</sup> <a name="grantee" id="cargo-lambda-cdk.RustFunction.grantInvokeUrl.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metric` <a name="metric" id="cargo-lambda-cdk.RustFunction.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Function.

###### `metricName`<sup>Required</sup> <a name="metricName" id="cargo-lambda-cdk.RustFunction.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricDuration` <a name="metricDuration" id="cargo-lambda-cdk.RustFunction.metricDuration"></a>

```typescript
public metricDuration(props?: MetricOptions): Metric
```

How long execution of this Lambda takes.

Average over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricDuration.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricErrors` <a name="metricErrors" id="cargo-lambda-cdk.RustFunction.metricErrors"></a>

```typescript
public metricErrors(props?: MetricOptions): Metric
```

How many invocations of this Lambda fail.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricErrors.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricInvocations` <a name="metricInvocations" id="cargo-lambda-cdk.RustFunction.metricInvocations"></a>

```typescript
public metricInvocations(props?: MetricOptions): Metric
```

How often this Lambda is invoked.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricInvocations.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricThrottles` <a name="metricThrottles" id="cargo-lambda-cdk.RustFunction.metricThrottles"></a>

```typescript
public metricThrottles(props?: MetricOptions): Metric
```

How often this Lambda is throttled.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricThrottles.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `addAlias` <a name="addAlias" id="cargo-lambda-cdk.RustFunction.addAlias"></a>

```typescript
public addAlias(aliasName: string, options?: AliasOptions): Alias
```

Defines an alias for this function.

The alias will automatically be updated to point to the latest version of
the function as it is being updated during a deployment.

```ts
declare const fn: lambda.Function;

fn.addAlias('Live');

// Is equivalent to

new lambda.Alias(this, 'AliasLive', {
   aliasName: 'Live',
   version: fn.currentVersion,
});
```

###### `aliasName`<sup>Required</sup> <a name="aliasName" id="cargo-lambda-cdk.RustFunction.addAlias.parameter.aliasName"></a>

- *Type:* string

The name of the alias.

---

###### `options`<sup>Optional</sup> <a name="options" id="cargo-lambda-cdk.RustFunction.addAlias.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.AliasOptions

Alias options.

---

##### `addEnvironment` <a name="addEnvironment" id="cargo-lambda-cdk.RustFunction.addEnvironment"></a>

```typescript
public addEnvironment(key: string, value: string, options?: EnvironmentOptions): Function
```

Adds an environment variable to this Lambda function.

If this is a ref to a Lambda function, this operation results in a no-op.

###### `key`<sup>Required</sup> <a name="key" id="cargo-lambda-cdk.RustFunction.addEnvironment.parameter.key"></a>

- *Type:* string

The environment variable key.

---

###### `value`<sup>Required</sup> <a name="value" id="cargo-lambda-cdk.RustFunction.addEnvironment.parameter.value"></a>

- *Type:* string

The environment variable's value.

---

###### `options`<sup>Optional</sup> <a name="options" id="cargo-lambda-cdk.RustFunction.addEnvironment.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.EnvironmentOptions

Environment variable options.

---

##### `addLayers` <a name="addLayers" id="cargo-lambda-cdk.RustFunction.addLayers"></a>

```typescript
public addLayers(layers: ...ILayerVersion[]): void
```

Adds one or more Lambda Layers to this Lambda function.

###### `layers`<sup>Required</sup> <a name="layers" id="cargo-lambda-cdk.RustFunction.addLayers.parameter.layers"></a>

- *Type:* ...aws-cdk-lib.aws_lambda.ILayerVersion[]

the layers to be added.

---

##### `invalidateVersionBasedOn` <a name="invalidateVersionBasedOn" id="cargo-lambda-cdk.RustFunction.invalidateVersionBasedOn"></a>

```typescript
public invalidateVersionBasedOn(x: string): void
```

Mix additional information into the hash of the Version object.

The Lambda Function construct does its best to automatically create a new
Version when anything about the Function changes (its code, its layers,
any of the other properties).

However, you can sometimes source information from places that the CDK cannot
look into, like the deploy-time values of SSM parameters. In those cases,
the CDK would not force the creation of a new Version object when it actually
should.

This method can be used to invalidate the current Version object. Pass in
any string into this method, and make sure the string changes when you know
a new Version needs to be created.

This method may be called more than once.

###### `x`<sup>Required</sup> <a name="x" id="cargo-lambda-cdk.RustFunction.invalidateVersionBasedOn.parameter.x"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cargo-lambda-cdk.RustFunction.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cargo-lambda-cdk.RustFunction.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cargo-lambda-cdk.RustFunction.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#cargo-lambda-cdk.RustFunction.classifyVersionProperty">classifyVersionProperty</a></code> | Record whether specific properties in the `AWS::Lambda::Function` resource should also be associated to the Version resource. |
| <code><a href="#cargo-lambda-cdk.RustFunction.fromFunctionArn">fromFunctionArn</a></code> | Import a lambda function into the CDK using its ARN. |
| <code><a href="#cargo-lambda-cdk.RustFunction.fromFunctionAttributes">fromFunctionAttributes</a></code> | Creates a Lambda function object which represents a function not defined within this stack. |
| <code><a href="#cargo-lambda-cdk.RustFunction.fromFunctionName">fromFunctionName</a></code> | Import a lambda function into the CDK using its name. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricAll">metricAll</a></code> | Return the given named metric for this Lambda. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricAllConcurrentExecutions">metricAllConcurrentExecutions</a></code> | Metric for the number of concurrent executions across all Lambdas. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricAllDuration">metricAllDuration</a></code> | Metric for the Duration executing all Lambdas. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricAllErrors">metricAllErrors</a></code> | Metric for the number of Errors executing all Lambdas. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricAllInvocations">metricAllInvocations</a></code> | Metric for the number of invocations of all Lambdas. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricAllThrottles">metricAllThrottles</a></code> | Metric for the number of throttled invocations of all Lambdas. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricAllUnreservedConcurrentExecutions">metricAllUnreservedConcurrentExecutions</a></code> | Metric for the number of unreserved concurrent executions across all Lambdas. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cargo-lambda-cdk.RustFunction.isConstruct"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cargo-lambda-cdk.RustFunction.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cargo-lambda-cdk.RustFunction.isOwnedResource"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cargo-lambda-cdk.RustFunction.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cargo-lambda-cdk.RustFunction.isResource"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cargo-lambda-cdk.RustFunction.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `classifyVersionProperty` <a name="classifyVersionProperty" id="cargo-lambda-cdk.RustFunction.classifyVersionProperty"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.classifyVersionProperty(propertyName: string, locked: boolean)
```

Record whether specific properties in the `AWS::Lambda::Function` resource should also be associated to the Version resource.

See 'currentVersion' section in the module README for more details.

###### `propertyName`<sup>Required</sup> <a name="propertyName" id="cargo-lambda-cdk.RustFunction.classifyVersionProperty.parameter.propertyName"></a>

- *Type:* string

The property to classify.

---

###### `locked`<sup>Required</sup> <a name="locked" id="cargo-lambda-cdk.RustFunction.classifyVersionProperty.parameter.locked"></a>

- *Type:* boolean

whether the property should be associated to the version or not.

---

##### `fromFunctionArn` <a name="fromFunctionArn" id="cargo-lambda-cdk.RustFunction.fromFunctionArn"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.fromFunctionArn(scope: Construct, id: string, functionArn: string)
```

Import a lambda function into the CDK using its ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="cargo-lambda-cdk.RustFunction.fromFunctionArn.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="cargo-lambda-cdk.RustFunction.fromFunctionArn.parameter.id"></a>

- *Type:* string

---

###### `functionArn`<sup>Required</sup> <a name="functionArn" id="cargo-lambda-cdk.RustFunction.fromFunctionArn.parameter.functionArn"></a>

- *Type:* string

---

##### `fromFunctionAttributes` <a name="fromFunctionAttributes" id="cargo-lambda-cdk.RustFunction.fromFunctionAttributes"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.fromFunctionAttributes(scope: Construct, id: string, attrs: FunctionAttributes)
```

Creates a Lambda function object which represents a function not defined within this stack.

###### `scope`<sup>Required</sup> <a name="scope" id="cargo-lambda-cdk.RustFunction.fromFunctionAttributes.parameter.scope"></a>

- *Type:* constructs.Construct

The parent construct.

---

###### `id`<sup>Required</sup> <a name="id" id="cargo-lambda-cdk.RustFunction.fromFunctionAttributes.parameter.id"></a>

- *Type:* string

The name of the lambda construct.

---

###### `attrs`<sup>Required</sup> <a name="attrs" id="cargo-lambda-cdk.RustFunction.fromFunctionAttributes.parameter.attrs"></a>

- *Type:* aws-cdk-lib.aws_lambda.FunctionAttributes

the attributes of the function to import.

---

##### `fromFunctionName` <a name="fromFunctionName" id="cargo-lambda-cdk.RustFunction.fromFunctionName"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.fromFunctionName(scope: Construct, id: string, functionName: string)
```

Import a lambda function into the CDK using its name.

###### `scope`<sup>Required</sup> <a name="scope" id="cargo-lambda-cdk.RustFunction.fromFunctionName.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="cargo-lambda-cdk.RustFunction.fromFunctionName.parameter.id"></a>

- *Type:* string

---

###### `functionName`<sup>Required</sup> <a name="functionName" id="cargo-lambda-cdk.RustFunction.fromFunctionName.parameter.functionName"></a>

- *Type:* string

---

##### `metricAll` <a name="metricAll" id="cargo-lambda-cdk.RustFunction.metricAll"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.metricAll(metricName: string, props?: MetricOptions)
```

Return the given named metric for this Lambda.

###### `metricName`<sup>Required</sup> <a name="metricName" id="cargo-lambda-cdk.RustFunction.metricAll.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricAll.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllConcurrentExecutions` <a name="metricAllConcurrentExecutions" id="cargo-lambda-cdk.RustFunction.metricAllConcurrentExecutions"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.metricAllConcurrentExecutions(props?: MetricOptions)
```

Metric for the number of concurrent executions across all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricAllConcurrentExecutions.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllDuration` <a name="metricAllDuration" id="cargo-lambda-cdk.RustFunction.metricAllDuration"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.metricAllDuration(props?: MetricOptions)
```

Metric for the Duration executing all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricAllDuration.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllErrors` <a name="metricAllErrors" id="cargo-lambda-cdk.RustFunction.metricAllErrors"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.metricAllErrors(props?: MetricOptions)
```

Metric for the number of Errors executing all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricAllErrors.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllInvocations` <a name="metricAllInvocations" id="cargo-lambda-cdk.RustFunction.metricAllInvocations"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.metricAllInvocations(props?: MetricOptions)
```

Metric for the number of invocations of all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricAllInvocations.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllThrottles` <a name="metricAllThrottles" id="cargo-lambda-cdk.RustFunction.metricAllThrottles"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.metricAllThrottles(props?: MetricOptions)
```

Metric for the number of throttled invocations of all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricAllThrottles.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllUnreservedConcurrentExecutions` <a name="metricAllUnreservedConcurrentExecutions" id="cargo-lambda-cdk.RustFunction.metricAllUnreservedConcurrentExecutions"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

RustFunction.metricAllUnreservedConcurrentExecutions(props?: MetricOptions)
```

Metric for the number of unreserved concurrent executions across all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="cargo-lambda-cdk.RustFunction.metricAllUnreservedConcurrentExecutions.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | The architecture of this Lambda Function (this is an optional attribute and defaults to X86_64). |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.connections">connections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | Access the Connections object. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.functionArn">functionArn</a></code> | <code>string</code> | ARN of this function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.functionName">functionName</a></code> | <code>string</code> | Name of this function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.grantPrincipal">grantPrincipal</a></code> | <code>aws-cdk-lib.aws_iam.IPrincipal</code> | The principal this Lambda Function is running as. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.isBoundToVpc">isBoundToVpc</a></code> | <code>boolean</code> | Whether or not this Lambda function was bound to a VPC. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.latestVersion">latestVersion</a></code> | <code>aws-cdk-lib.aws_lambda.IVersion</code> | The `$LATEST` version of this function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.permissionsNode">permissionsNode</a></code> | <code>constructs.Node</code> | The construct node where permissions are attached. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.resourceArnsForGrantInvoke">resourceArnsForGrantInvoke</a></code> | <code>string[]</code> | The ARN(s) to put into the resource field of the generated IAM policy for grantInvoke(). |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | Execution role associated with this function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.currentVersion">currentVersion</a></code> | <code>aws-cdk-lib.aws_lambda.Version</code> | Returns a `lambda.Version` which represents the current version of this Lambda function. A new version will be created every time the function's configuration changes. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | The LogGroup where the Lambda function's logs are made available. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.runtime">runtime</a></code> | <code>aws-cdk-lib.aws_lambda.Runtime</code> | The runtime configured for this lambda. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.deadLetterQueue">deadLetterQueue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The DLQ (as queue) associated with this Lambda Function (this is an optional attribute). |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.deadLetterTopic">deadLetterTopic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The DLQ (as topic) associated with this Lambda Function (this is an optional attribute). |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | The timeout configured for this lambda. |

---

##### `node`<sup>Required</sup> <a name="node" id="cargo-lambda-cdk.RustFunction.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cargo-lambda-cdk.RustFunction.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cargo-lambda-cdk.RustFunction.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `architecture`<sup>Required</sup> <a name="architecture" id="cargo-lambda-cdk.RustFunction.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* aws-cdk-lib.aws_lambda.Architecture

The architecture of this Lambda Function (this is an optional attribute and defaults to X86_64).

---

##### `connections`<sup>Required</sup> <a name="connections" id="cargo-lambda-cdk.RustFunction.property.connections"></a>

```typescript
public readonly connections: Connections;
```

- *Type:* aws-cdk-lib.aws_ec2.Connections

Access the Connections object.

Will fail if not a VPC-enabled Lambda Function

---

##### `functionArn`<sup>Required</sup> <a name="functionArn" id="cargo-lambda-cdk.RustFunction.property.functionArn"></a>

```typescript
public readonly functionArn: string;
```

- *Type:* string

ARN of this function.

---

##### `functionName`<sup>Required</sup> <a name="functionName" id="cargo-lambda-cdk.RustFunction.property.functionName"></a>

```typescript
public readonly functionName: string;
```

- *Type:* string

Name of this function.

---

##### `grantPrincipal`<sup>Required</sup> <a name="grantPrincipal" id="cargo-lambda-cdk.RustFunction.property.grantPrincipal"></a>

```typescript
public readonly grantPrincipal: IPrincipal;
```

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

The principal this Lambda Function is running as.

---

##### `isBoundToVpc`<sup>Required</sup> <a name="isBoundToVpc" id="cargo-lambda-cdk.RustFunction.property.isBoundToVpc"></a>

```typescript
public readonly isBoundToVpc: boolean;
```

- *Type:* boolean

Whether or not this Lambda function was bound to a VPC.

If this is is `false`, trying to access the `connections` object will fail.

---

##### `latestVersion`<sup>Required</sup> <a name="latestVersion" id="cargo-lambda-cdk.RustFunction.property.latestVersion"></a>

```typescript
public readonly latestVersion: IVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.IVersion

The `$LATEST` version of this function.

Note that this is reference to a non-specific AWS Lambda version, which
means the function this version refers to can return different results in
different invocations.

To obtain a reference to an explicit version which references the current
function configuration, use `lambdaFunction.currentVersion` instead.

---

##### `permissionsNode`<sup>Required</sup> <a name="permissionsNode" id="cargo-lambda-cdk.RustFunction.property.permissionsNode"></a>

```typescript
public readonly permissionsNode: Node;
```

- *Type:* constructs.Node

The construct node where permissions are attached.

---

##### `resourceArnsForGrantInvoke`<sup>Required</sup> <a name="resourceArnsForGrantInvoke" id="cargo-lambda-cdk.RustFunction.property.resourceArnsForGrantInvoke"></a>

```typescript
public readonly resourceArnsForGrantInvoke: string[];
```

- *Type:* string[]

The ARN(s) to put into the resource field of the generated IAM policy for grantInvoke().

---

##### `role`<sup>Optional</sup> <a name="role" id="cargo-lambda-cdk.RustFunction.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

Execution role associated with this function.

---

##### `currentVersion`<sup>Required</sup> <a name="currentVersion" id="cargo-lambda-cdk.RustFunction.property.currentVersion"></a>

```typescript
public readonly currentVersion: Version;
```

- *Type:* aws-cdk-lib.aws_lambda.Version

Returns a `lambda.Version` which represents the current version of this Lambda function. A new version will be created every time the function's configuration changes.

You can specify options for this version using the `currentVersionOptions`
prop when initializing the `lambda.Function`.

---

##### `logGroup`<sup>Required</sup> <a name="logGroup" id="cargo-lambda-cdk.RustFunction.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

The LogGroup where the Lambda function's logs are made available.

If either `logRetention` is set or this property is called, a CloudFormation custom resource is added to the stack that
pre-creates the log group as part of the stack deployment, if it already doesn't exist, and sets the correct log retention
period (never expire, by default).

Further, if the log group already exists and the `logRetention` is not set, the custom resource will reset the log retention
to never expire even if it was configured with a different value.

---

##### `runtime`<sup>Required</sup> <a name="runtime" id="cargo-lambda-cdk.RustFunction.property.runtime"></a>

```typescript
public readonly runtime: Runtime;
```

- *Type:* aws-cdk-lib.aws_lambda.Runtime

The runtime configured for this lambda.

---

##### `deadLetterQueue`<sup>Optional</sup> <a name="deadLetterQueue" id="cargo-lambda-cdk.RustFunction.property.deadLetterQueue"></a>

```typescript
public readonly deadLetterQueue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue

The DLQ (as queue) associated with this Lambda Function (this is an optional attribute).

---

##### `deadLetterTopic`<sup>Optional</sup> <a name="deadLetterTopic" id="cargo-lambda-cdk.RustFunction.property.deadLetterTopic"></a>

```typescript
public readonly deadLetterTopic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The DLQ (as topic) associated with this Lambda Function (this is an optional attribute).

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="cargo-lambda-cdk.RustFunction.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration

The timeout configured for this lambda.

---


## Structs <a name="Structs" id="Structs"></a>

### BundlingOptions <a name="BundlingOptions" id="cargo-lambda-cdk.BundlingOptions"></a>

Bundling options.

#### Initializer <a name="Initializer" id="cargo-lambda-cdk.BundlingOptions.Initializer"></a>

```typescript
import { BundlingOptions } from 'cargo-lambda-cdk'

const bundlingOptions: BundlingOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | The system architecture of the lambda function. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.assetHash">assetHash</a></code> | <code>string</code> | Specify a custom hash for this asset. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.assetHashType">assetHashType</a></code> | <code>aws-cdk-lib.AssetHashType</code> | Determines how the asset hash is calculated. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.cargoLambdaFlags">cargoLambdaFlags</a></code> | <code>string[]</code> | Additional list of flags to pass to `cargo lambda build`. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.commandHooks">commandHooks</a></code> | <code><a href="#cargo-lambda-cdk.ICommandHooks">ICommandHooks</a></code> | Command hooks. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.dockerImage">dockerImage</a></code> | <code>aws-cdk-lib.DockerImage</code> | A custom bundling Docker image. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.dockerOptions">dockerOptions</a></code> | <code><a href="#cargo-lambda-cdk.DockerOptions">DockerOptions</a></code> | Additional options when using docker bundling. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.environment">environment</a></code> | <code>{[ key: string ]: string}</code> | Environment variables defined when Cargo runs. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.forcedDockerBundling">forcedDockerBundling</a></code> | <code>boolean</code> | Force bundling in a Docker container even if local bundling is possible. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.profile">profile</a></code> | <code>string</code> | Specify the Cargo Build profile to use. |

---

##### `architecture`<sup>Optional</sup> <a name="architecture" id="cargo-lambda-cdk.BundlingOptions.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* aws-cdk-lib.aws_lambda.Architecture
- *Default:* X86_64

The system architecture of the lambda function.

---

##### `assetHash`<sup>Optional</sup> <a name="assetHash" id="cargo-lambda-cdk.BundlingOptions.property.assetHash"></a>

```typescript
public readonly assetHash: string;
```

- *Type:* string
- *Default:* based on `assetHashType`

Specify a custom hash for this asset.

If `assetHashType` is set it must
be set to `AssetHashType.CUSTOM`. For consistency, this custom hash will
be SHA256 hashed and encoded as hex. The resulting hash will be the asset
hash.

NOTE: the hash is used in order to identify a specific revision of the asset, and
used for optimizing and caching deployment activities related to this asset such as
packaging, uploading to Amazon S3, etc. If you chose to customize the hash, you will
need to make sure it is updated every time the asset changes, or otherwise it is
possible that some deployments will not be invalidated.

---

##### `assetHashType`<sup>Optional</sup> <a name="assetHashType" id="cargo-lambda-cdk.BundlingOptions.property.assetHashType"></a>

```typescript
public readonly assetHashType: AssetHashType;
```

- *Type:* aws-cdk-lib.AssetHashType
- *Default:* AssetHashType.OUTPUT. If `assetHash` is also specified, the default is `CUSTOM`.

Determines how the asset hash is calculated.

Assets will
get rebuilt and uploaded only if their hash has changed.

---

##### `cargoLambdaFlags`<sup>Optional</sup> <a name="cargoLambdaFlags" id="cargo-lambda-cdk.BundlingOptions.property.cargoLambdaFlags"></a>

```typescript
public readonly cargoLambdaFlags: string[];
```

- *Type:* string[]

Additional list of flags to pass to `cargo lambda build`.

---

##### `commandHooks`<sup>Optional</sup> <a name="commandHooks" id="cargo-lambda-cdk.BundlingOptions.property.commandHooks"></a>

```typescript
public readonly commandHooks: ICommandHooks;
```

- *Type:* <a href="#cargo-lambda-cdk.ICommandHooks">ICommandHooks</a>
- *Default:* do not run additional commands

Command hooks.

---

##### `dockerImage`<sup>Optional</sup> <a name="dockerImage" id="cargo-lambda-cdk.BundlingOptions.property.dockerImage"></a>

```typescript
public readonly dockerImage: DockerImage;
```

- *Type:* aws-cdk-lib.DockerImage
- *Default:* use the Docker image provided by calavera/cargo-lambda:latest

A custom bundling Docker image.

---

##### `dockerOptions`<sup>Optional</sup> <a name="dockerOptions" id="cargo-lambda-cdk.BundlingOptions.property.dockerOptions"></a>

```typescript
public readonly dockerOptions: DockerOptions;
```

- *Type:* <a href="#cargo-lambda-cdk.DockerOptions">DockerOptions</a>
- *Default:* the same defaults as specified by `cdk.BundlingOptions`

Additional options when using docker bundling.

---

##### `environment`<sup>Optional</sup> <a name="environment" id="cargo-lambda-cdk.BundlingOptions.property.environment"></a>

```typescript
public readonly environment: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* no environment variables are defined.

Environment variables defined when Cargo runs.

---

##### `forcedDockerBundling`<sup>Optional</sup> <a name="forcedDockerBundling" id="cargo-lambda-cdk.BundlingOptions.property.forcedDockerBundling"></a>

```typescript
public readonly forcedDockerBundling: boolean;
```

- *Type:* boolean
- *Default:* false

Force bundling in a Docker container even if local bundling is possible.

---

##### `profile`<sup>Optional</sup> <a name="profile" id="cargo-lambda-cdk.BundlingOptions.property.profile"></a>

```typescript
public readonly profile: string;
```

- *Type:* string
- *Default:* `release`

Specify the Cargo Build profile to use.

---

### DockerOptions <a name="DockerOptions" id="cargo-lambda-cdk.DockerOptions"></a>

Additional docker options when using docker bundling.

Default values here inherit
from `cdk.BundlingOptions`.

#### Initializer <a name="Initializer" id="cargo-lambda-cdk.DockerOptions.Initializer"></a>

```typescript
import { DockerOptions } from 'cargo-lambda-cdk'

const dockerOptions: DockerOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.bundlingFileAccess">bundlingFileAccess</a></code> | <code>aws-cdk-lib.BundlingFileAccess</code> | The access mechanism used to make source files available to the bundling container and to return the bundling output back to the host. |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.command">command</a></code> | <code>string[]</code> | The command to run in the Docker container. |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.entrypoint">entrypoint</a></code> | <code>string[]</code> | The entrypoint to run in the Docker container. |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.local">local</a></code> | <code>aws-cdk-lib.ILocalBundling</code> | Local bundling provider. |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.network">network</a></code> | <code>string</code> | Docker [Networking options](https://docs.docker.com/engine/reference/commandline/run/#connect-a-container-to-a-network---network). |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.outputType">outputType</a></code> | <code>aws-cdk-lib.BundlingOutput</code> | The type of output that this bundling operation is producing. |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.securityOpt">securityOpt</a></code> | <code>string</code> | [Security configuration](https://docs.docker.com/engine/reference/run/#security-configuration) when running the docker container. |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.user">user</a></code> | <code>string</code> | The user to use when running the Docker container. |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.volumes">volumes</a></code> | <code>aws-cdk-lib.DockerVolume[]</code> | Additional Docker volumes to mount. |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.volumesFrom">volumesFrom</a></code> | <code>string[]</code> | Where to mount the specified volumes from. |
| <code><a href="#cargo-lambda-cdk.DockerOptions.property.workingDirectory">workingDirectory</a></code> | <code>string</code> | Working directory inside the Docker container. |

---

##### `bundlingFileAccess`<sup>Optional</sup> <a name="bundlingFileAccess" id="cargo-lambda-cdk.DockerOptions.property.bundlingFileAccess"></a>

```typescript
public readonly bundlingFileAccess: BundlingFileAccess;
```

- *Type:* aws-cdk-lib.BundlingFileAccess
- *Default:* BundlingFileAccess.BIND_MOUNT

The access mechanism used to make source files available to the bundling container and to return the bundling output back to the host.

---

##### `command`<sup>Optional</sup> <a name="command" id="cargo-lambda-cdk.DockerOptions.property.command"></a>

```typescript
public readonly command: string[];
```

- *Type:* string[]
- *Default:* a cargo lambda compilation

The command to run in the Docker container.

This is normally controlled by the `RustFunction`
but can be overridden here.

---

##### `entrypoint`<sup>Optional</sup> <a name="entrypoint" id="cargo-lambda-cdk.DockerOptions.property.entrypoint"></a>

```typescript
public readonly entrypoint: string[];
```

- *Type:* string[]
- *Default:* run the entrypoint defined in the image

The entrypoint to run in the Docker container.

> [https://docs.docker.com/engine/reference/builder/#entrypoint](https://docs.docker.com/engine/reference/builder/#entrypoint)

---

##### `local`<sup>Optional</sup> <a name="local" id="cargo-lambda-cdk.DockerOptions.property.local"></a>

```typescript
public readonly local: ILocalBundling;
```

- *Type:* aws-cdk-lib.ILocalBundling
- *Default:* bundling will be performed locally if Rust and cargo-lambda are installed and `forcedDockerBundling` is not true, otherwise it will be performed in the docker container

Local bundling provider.

This is normally controlled by the `RustFunction`
but can be overridden here.

---

##### `network`<sup>Optional</sup> <a name="network" id="cargo-lambda-cdk.DockerOptions.property.network"></a>

```typescript
public readonly network: string;
```

- *Type:* string
- *Default:* no networking options

Docker [Networking options](https://docs.docker.com/engine/reference/commandline/run/#connect-a-container-to-a-network---network).

---

##### `outputType`<sup>Optional</sup> <a name="outputType" id="cargo-lambda-cdk.DockerOptions.property.outputType"></a>

```typescript
public readonly outputType: BundlingOutput;
```

- *Type:* aws-cdk-lib.BundlingOutput
- *Default:* BundlingOutput.AUTO_DISCOVER

The type of output that this bundling operation is producing.

---

##### `securityOpt`<sup>Optional</sup> <a name="securityOpt" id="cargo-lambda-cdk.DockerOptions.property.securityOpt"></a>

```typescript
public readonly securityOpt: string;
```

- *Type:* string
- *Default:* no security options

[Security configuration](https://docs.docker.com/engine/reference/run/#security-configuration) when running the docker container.

---

##### `user`<sup>Optional</sup> <a name="user" id="cargo-lambda-cdk.DockerOptions.property.user"></a>

```typescript
public readonly user: string;
```

- *Type:* string
- *Default:* uid:gid of the current user or 1000:1000 on Windows

The user to use when running the Docker container.

user | user:group | uid | uid:gid | user:gid | uid:group

> [https://docs.docker.com/engine/reference/run/#user](https://docs.docker.com/engine/reference/run/#user)

---

##### `volumes`<sup>Optional</sup> <a name="volumes" id="cargo-lambda-cdk.DockerOptions.property.volumes"></a>

```typescript
public readonly volumes: DockerVolume[];
```

- *Type:* aws-cdk-lib.DockerVolume[]
- *Default:* no additional volumes are mounted

Additional Docker volumes to mount.

---

##### `volumesFrom`<sup>Optional</sup> <a name="volumesFrom" id="cargo-lambda-cdk.DockerOptions.property.volumesFrom"></a>

```typescript
public readonly volumesFrom: string[];
```

- *Type:* string[]
- *Default:* no containers are specified to mount volumes from

Where to mount the specified volumes from.

> [https://docs.docker.com/engine/reference/commandline/run/#mount-volumes-from-container---volumes-from](https://docs.docker.com/engine/reference/commandline/run/#mount-volumes-from-container---volumes-from)

---

##### `workingDirectory`<sup>Optional</sup> <a name="workingDirectory" id="cargo-lambda-cdk.DockerOptions.property.workingDirectory"></a>

```typescript
public readonly workingDirectory: string;
```

- *Type:* string
- *Default:* /asset-input

Working directory inside the Docker container.

---

### RustExtensionProps <a name="RustExtensionProps" id="cargo-lambda-cdk.RustExtensionProps"></a>

#### Initializer <a name="Initializer" id="cargo-lambda-cdk.RustExtensionProps.Initializer"></a>

```typescript
import { RustExtensionProps } from 'cargo-lambda-cdk'

const rustExtensionProps: RustExtensionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cargo-lambda-cdk.RustExtensionProps.property.description">description</a></code> | <code>string</code> | The description the this Lambda Layer. |
| <code><a href="#cargo-lambda-cdk.RustExtensionProps.property.layerVersionName">layerVersionName</a></code> | <code>string</code> | The name of the layer. |
| <code><a href="#cargo-lambda-cdk.RustExtensionProps.property.license">license</a></code> | <code>string</code> | The SPDX licence identifier or URL to the license file for this layer. |
| <code><a href="#cargo-lambda-cdk.RustExtensionProps.property.removalPolicy">removalPolicy</a></code> | <code>aws-cdk-lib.RemovalPolicy</code> | Whether to retain this version of the layer when a new version is added or when the stack is deleted. |
| <code><a href="#cargo-lambda-cdk.RustExtensionProps.property.alwaysClone">alwaysClone</a></code> | <code>boolean</code> | Always clone the repository if using a git `manifestPath`, even if it has already been cloned to the temporary directory. |
| <code><a href="#cargo-lambda-cdk.RustExtensionProps.property.binaryName">binaryName</a></code> | <code>string</code> | The name of the binary to build, in case that's different than the package's name. |
| <code><a href="#cargo-lambda-cdk.RustExtensionProps.property.branch">branch</a></code> | <code>string</code> | The branch to clone if the `manifestPath` is a git repository. |
| <code><a href="#cargo-lambda-cdk.RustExtensionProps.property.bundling">bundling</a></code> | <code><a href="#cargo-lambda-cdk.BundlingOptions">BundlingOptions</a></code> | Bundling options. |
| <code><a href="#cargo-lambda-cdk.RustExtensionProps.property.manifestPath">manifestPath</a></code> | <code>string</code> | Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly. |

---

##### `description`<sup>Optional</sup> <a name="description" id="cargo-lambda-cdk.RustExtensionProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

The description the this Lambda Layer.

---

##### `layerVersionName`<sup>Optional</sup> <a name="layerVersionName" id="cargo-lambda-cdk.RustExtensionProps.property.layerVersionName"></a>

```typescript
public readonly layerVersionName: string;
```

- *Type:* string
- *Default:* A name will be generated.

The name of the layer.

---

##### `license`<sup>Optional</sup> <a name="license" id="cargo-lambda-cdk.RustExtensionProps.property.license"></a>

```typescript
public readonly license: string;
```

- *Type:* string
- *Default:* No license information will be recorded.

The SPDX licence identifier or URL to the license file for this layer.

---

##### `removalPolicy`<sup>Optional</sup> <a name="removalPolicy" id="cargo-lambda-cdk.RustExtensionProps.property.removalPolicy"></a>

```typescript
public readonly removalPolicy: RemovalPolicy;
```

- *Type:* aws-cdk-lib.RemovalPolicy
- *Default:* RemovalPolicy.DESTROY

Whether to retain this version of the layer when a new version is added or when the stack is deleted.

---

##### `alwaysClone`<sup>Optional</sup> <a name="alwaysClone" id="cargo-lambda-cdk.RustExtensionProps.property.alwaysClone"></a>

```typescript
public readonly alwaysClone: boolean;
```

- *Type:* boolean
- *Default:* clones only if the repository and branch does not already exist in the temporary directory.

Always clone the repository if using a git `manifestPath`, even if it has already been cloned to the temporary directory.

---

##### `binaryName`<sup>Optional</sup> <a name="binaryName" id="cargo-lambda-cdk.RustExtensionProps.property.binaryName"></a>

```typescript
public readonly binaryName: string;
```

- *Type:* string

The name of the binary to build, in case that's different than the package's name.

---

##### `branch`<sup>Optional</sup> <a name="branch" id="cargo-lambda-cdk.RustExtensionProps.property.branch"></a>

```typescript
public readonly branch: string;
```

- *Type:* string
- *Default:* the default branch, i.e. HEAD.

The branch to clone if the `manifestPath` is a git repository.

---

##### `bundling`<sup>Optional</sup> <a name="bundling" id="cargo-lambda-cdk.RustExtensionProps.property.bundling"></a>

```typescript
public readonly bundling: BundlingOptions;
```

- *Type:* <a href="#cargo-lambda-cdk.BundlingOptions">BundlingOptions</a>
- *Default:* use default bundling options

Bundling options.

---

##### `manifestPath`<sup>Optional</sup> <a name="manifestPath" id="cargo-lambda-cdk.RustExtensionProps.property.manifestPath"></a>

```typescript
public readonly manifestPath: string;
```

- *Type:* string
- *Default:* check the current directory for a `Cargo.toml` file, and throws an error if the file doesn't exist.

Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly.

This will accept a directory path containing a `Cargo.toml` file, a filepath to your
`Cargo.toml` file (i.e. `path/to/Cargo.toml`), or a git repository URL
(e.g. `https://github.com/your_user/your_repo`).

When using a git repository URL, the repository will be cloned to a temporary directory.

---

### RustFunctionProps <a name="RustFunctionProps" id="cargo-lambda-cdk.RustFunctionProps"></a>

Properties for a RustFunction.

#### Initializer <a name="Initializer" id="cargo-lambda-cdk.RustFunctionProps.Initializer"></a>

```typescript
import { RustFunctionProps } from 'cargo-lambda-cdk'

const rustFunctionProps: RustFunctionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.maxEventAge">maxEventAge</a></code> | <code>aws-cdk-lib.Duration</code> | The maximum age of a request that Lambda sends to a function for processing. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.onFailure">onFailure</a></code> | <code>aws-cdk-lib.aws_lambda.IDestination</code> | The destination for failed invocations. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.onSuccess">onSuccess</a></code> | <code>aws-cdk-lib.aws_lambda.IDestination</code> | The destination for successful invocations. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.retryAttempts">retryAttempts</a></code> | <code>number</code> | The maximum number of times to retry when the function returns an error. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.adotInstrumentation">adotInstrumentation</a></code> | <code>aws-cdk-lib.aws_lambda.AdotInstrumentationConfig</code> | Specify the configuration of AWS Distro for OpenTelemetry (ADOT) instrumentation. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.allowAllOutbound">allowAllOutbound</a></code> | <code>boolean</code> | Whether to allow the Lambda to send all network traffic. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.allowPublicSubnet">allowPublicSubnet</a></code> | <code>boolean</code> | Lambda Functions in a public subnet can NOT access the internet. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | The system architectures compatible with this lambda function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.codeSigningConfig">codeSigningConfig</a></code> | <code>aws-cdk-lib.aws_lambda.ICodeSigningConfig</code> | Code signing config associated with this function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.currentVersionOptions">currentVersionOptions</a></code> | <code>aws-cdk-lib.aws_lambda.VersionOptions</code> | Options for the `lambda.Version` resource automatically created by the `fn.currentVersion` method. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.deadLetterQueue">deadLetterQueue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The SQS queue to use if DLQ is enabled. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.deadLetterQueueEnabled">deadLetterQueueEnabled</a></code> | <code>boolean</code> | Enabled DLQ. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.deadLetterTopic">deadLetterTopic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The SNS topic to use as a DLQ. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.description">description</a></code> | <code>string</code> | A description of the function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.environment">environment</a></code> | <code>{[ key: string ]: string}</code> | Key-value pairs that Lambda caches and makes available for your Lambda functions. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.environmentEncryption">environmentEncryption</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | The AWS KMS key that's used to encrypt your function's environment variables. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.ephemeralStorageSize">ephemeralStorageSize</a></code> | <code>aws-cdk-lib.Size</code> | The size of the function’s /tmp directory in MiB. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.events">events</a></code> | <code>aws-cdk-lib.aws_lambda.IEventSource[]</code> | Event sources for this function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.filesystem">filesystem</a></code> | <code>aws-cdk-lib.aws_lambda.FileSystem</code> | The filesystem configuration for the lambda function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.functionName">functionName</a></code> | <code>string</code> | A name for the function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.initialPolicy">initialPolicy</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | Initial policy statements to add to the created Lambda Role. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.insightsVersion">insightsVersion</a></code> | <code>aws-cdk-lib.aws_lambda.LambdaInsightsVersion</code> | Specify the version of CloudWatch Lambda insights to use for monitoring. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.layers">layers</a></code> | <code>aws-cdk-lib.aws_lambda.ILayerVersion[]</code> | A list of layers to add to the function's execution environment. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.logRetention">logRetention</a></code> | <code>aws-cdk-lib.aws_logs.RetentionDays</code> | The number of days log events are kept in CloudWatch Logs. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.logRetentionRetryOptions">logRetentionRetryOptions</a></code> | <code>aws-cdk-lib.aws_lambda.LogRetentionRetryOptions</code> | When log retention is specified, a custom resource attempts to create the CloudWatch log group. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.logRetentionRole">logRetentionRole</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | The IAM role for the Lambda function associated with the custom resource that sets the retention policy. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.memorySize">memorySize</a></code> | <code>number</code> | The amount of memory, in MB, that is allocated to your Lambda function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.profiling">profiling</a></code> | <code>boolean</code> | Enable profiling. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.profilingGroup">profilingGroup</a></code> | <code>aws-cdk-lib.aws_codeguruprofiler.IProfilingGroup</code> | Profiling Group. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.reservedConcurrentExecutions">reservedConcurrentExecutions</a></code> | <code>number</code> | The maximum of concurrent executions you want to reserve for the function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | Lambda execution role. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | The list of security groups to associate with the Lambda's network interfaces. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | The function execution time (in seconds) after which Lambda terminates the function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.tracing">tracing</a></code> | <code>aws-cdk-lib.aws_lambda.Tracing</code> | Enable AWS X-Ray Tracing for Lambda Function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | VPC network to place Lambda network interfaces. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.vpcSubnets">vpcSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Where to place the network interfaces within the VPC. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.alwaysClone">alwaysClone</a></code> | <code>boolean</code> | Always clone the repository if using a git `manifestPath`, even if it has already been cloned to the temporary directory. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.binaryName">binaryName</a></code> | <code>string</code> | The name of the binary to build, in case that's different than the package's name. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.branch">branch</a></code> | <code>string</code> | The branch to clone if the `manifestPath` is a git repository. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.bundling">bundling</a></code> | <code><a href="#cargo-lambda-cdk.BundlingOptions">BundlingOptions</a></code> | Bundling options. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.manifestPath">manifestPath</a></code> | <code>string</code> | Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.runtime">runtime</a></code> | <code>string</code> | The Lambda runtime to deploy this function. |

---

##### `maxEventAge`<sup>Optional</sup> <a name="maxEventAge" id="cargo-lambda-cdk.RustFunctionProps.property.maxEventAge"></a>

```typescript
public readonly maxEventAge: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.hours(6)

The maximum age of a request that Lambda sends to a function for processing.

Minimum: 60 seconds
Maximum: 6 hours

---

##### `onFailure`<sup>Optional</sup> <a name="onFailure" id="cargo-lambda-cdk.RustFunctionProps.property.onFailure"></a>

```typescript
public readonly onFailure: IDestination;
```

- *Type:* aws-cdk-lib.aws_lambda.IDestination
- *Default:* no destination

The destination for failed invocations.

---

##### `onSuccess`<sup>Optional</sup> <a name="onSuccess" id="cargo-lambda-cdk.RustFunctionProps.property.onSuccess"></a>

```typescript
public readonly onSuccess: IDestination;
```

- *Type:* aws-cdk-lib.aws_lambda.IDestination
- *Default:* no destination

The destination for successful invocations.

---

##### `retryAttempts`<sup>Optional</sup> <a name="retryAttempts" id="cargo-lambda-cdk.RustFunctionProps.property.retryAttempts"></a>

```typescript
public readonly retryAttempts: number;
```

- *Type:* number
- *Default:* 2

The maximum number of times to retry when the function returns an error.

Minimum: 0
Maximum: 2

---

##### `adotInstrumentation`<sup>Optional</sup> <a name="adotInstrumentation" id="cargo-lambda-cdk.RustFunctionProps.property.adotInstrumentation"></a>

```typescript
public readonly adotInstrumentation: AdotInstrumentationConfig;
```

- *Type:* aws-cdk-lib.aws_lambda.AdotInstrumentationConfig
- *Default:* No ADOT instrumentation

Specify the configuration of AWS Distro for OpenTelemetry (ADOT) instrumentation.

> [https://aws-otel.github.io/docs/getting-started/lambda](https://aws-otel.github.io/docs/getting-started/lambda)

---

##### `allowAllOutbound`<sup>Optional</sup> <a name="allowAllOutbound" id="cargo-lambda-cdk.RustFunctionProps.property.allowAllOutbound"></a>

```typescript
public readonly allowAllOutbound: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to allow the Lambda to send all network traffic.

If set to false, you must individually add traffic rules to allow the
Lambda to connect to network targets.

---

##### `allowPublicSubnet`<sup>Optional</sup> <a name="allowPublicSubnet" id="cargo-lambda-cdk.RustFunctionProps.property.allowPublicSubnet"></a>

```typescript
public readonly allowPublicSubnet: boolean;
```

- *Type:* boolean
- *Default:* false

Lambda Functions in a public subnet can NOT access the internet.

Use this property to acknowledge this limitation and still place the function in a public subnet.

> [https://stackoverflow.com/questions/52992085/why-cant-an-aws-lambda-function-inside-a-public-subnet-in-a-vpc-connect-to-the/52994841#52994841](https://stackoverflow.com/questions/52992085/why-cant-an-aws-lambda-function-inside-a-public-subnet-in-a-vpc-connect-to-the/52994841#52994841)

---

##### `architecture`<sup>Optional</sup> <a name="architecture" id="cargo-lambda-cdk.RustFunctionProps.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* aws-cdk-lib.aws_lambda.Architecture
- *Default:* Architecture.X86_64

The system architectures compatible with this lambda function.

---

##### `codeSigningConfig`<sup>Optional</sup> <a name="codeSigningConfig" id="cargo-lambda-cdk.RustFunctionProps.property.codeSigningConfig"></a>

```typescript
public readonly codeSigningConfig: ICodeSigningConfig;
```

- *Type:* aws-cdk-lib.aws_lambda.ICodeSigningConfig
- *Default:* Not Sign the Code

Code signing config associated with this function.

---

##### `currentVersionOptions`<sup>Optional</sup> <a name="currentVersionOptions" id="cargo-lambda-cdk.RustFunctionProps.property.currentVersionOptions"></a>

```typescript
public readonly currentVersionOptions: VersionOptions;
```

- *Type:* aws-cdk-lib.aws_lambda.VersionOptions
- *Default:* default options as described in `VersionOptions`

Options for the `lambda.Version` resource automatically created by the `fn.currentVersion` method.

---

##### `deadLetterQueue`<sup>Optional</sup> <a name="deadLetterQueue" id="cargo-lambda-cdk.RustFunctionProps.property.deadLetterQueue"></a>

```typescript
public readonly deadLetterQueue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue
- *Default:* SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`

The SQS queue to use if DLQ is enabled.

If SNS topic is desired, specify `deadLetterTopic` property instead.

---

##### `deadLetterQueueEnabled`<sup>Optional</sup> <a name="deadLetterQueueEnabled" id="cargo-lambda-cdk.RustFunctionProps.property.deadLetterQueueEnabled"></a>

```typescript
public readonly deadLetterQueueEnabled: boolean;
```

- *Type:* boolean
- *Default:* false unless `deadLetterQueue` is set, which implies DLQ is enabled.

Enabled DLQ.

If `deadLetterQueue` is undefined,
an SQS queue with default options will be defined for your Function.

---

##### `deadLetterTopic`<sup>Optional</sup> <a name="deadLetterTopic" id="cargo-lambda-cdk.RustFunctionProps.property.deadLetterTopic"></a>

```typescript
public readonly deadLetterTopic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic
- *Default:* no SNS topic

The SNS topic to use as a DLQ.

Note that if `deadLetterQueueEnabled` is set to `true`, an SQS queue will be created
rather than an SNS topic. Using an SNS topic as a DLQ requires this property to be set explicitly.

---

##### `description`<sup>Optional</sup> <a name="description" id="cargo-lambda-cdk.RustFunctionProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

A description of the function.

---

##### `environment`<sup>Optional</sup> <a name="environment" id="cargo-lambda-cdk.RustFunctionProps.property.environment"></a>

```typescript
public readonly environment: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* No environment variables.

Key-value pairs that Lambda caches and makes available for your Lambda functions.

Use environment variables to apply configuration changes, such
as test and production environment configurations, without changing your
Lambda function source code.

---

##### `environmentEncryption`<sup>Optional</sup> <a name="environmentEncryption" id="cargo-lambda-cdk.RustFunctionProps.property.environmentEncryption"></a>

```typescript
public readonly environmentEncryption: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey
- *Default:* AWS Lambda creates and uses an AWS managed customer master key (CMK).

The AWS KMS key that's used to encrypt your function's environment variables.

---

##### `ephemeralStorageSize`<sup>Optional</sup> <a name="ephemeralStorageSize" id="cargo-lambda-cdk.RustFunctionProps.property.ephemeralStorageSize"></a>

```typescript
public readonly ephemeralStorageSize: Size;
```

- *Type:* aws-cdk-lib.Size
- *Default:* 512 MiB

The size of the function’s /tmp directory in MiB.

---

##### `events`<sup>Optional</sup> <a name="events" id="cargo-lambda-cdk.RustFunctionProps.property.events"></a>

```typescript
public readonly events: IEventSource[];
```

- *Type:* aws-cdk-lib.aws_lambda.IEventSource[]
- *Default:* No event sources.

Event sources for this function.

You can also add event sources using `addEventSource`.

---

##### `filesystem`<sup>Optional</sup> <a name="filesystem" id="cargo-lambda-cdk.RustFunctionProps.property.filesystem"></a>

```typescript
public readonly filesystem: FileSystem;
```

- *Type:* aws-cdk-lib.aws_lambda.FileSystem
- *Default:* will not mount any filesystem

The filesystem configuration for the lambda function.

---

##### `functionName`<sup>Optional</sup> <a name="functionName" id="cargo-lambda-cdk.RustFunctionProps.property.functionName"></a>

```typescript
public readonly functionName: string;
```

- *Type:* string
- *Default:* AWS CloudFormation generates a unique physical ID and uses that ID for the function's name. For more information, see Name Type.

A name for the function.

---

##### `initialPolicy`<sup>Optional</sup> <a name="initialPolicy" id="cargo-lambda-cdk.RustFunctionProps.property.initialPolicy"></a>

```typescript
public readonly initialPolicy: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]
- *Default:* No policy statements are added to the created Lambda role.

Initial policy statements to add to the created Lambda Role.

You can call `addToRolePolicy` to the created lambda to add statements post creation.

---

##### `insightsVersion`<sup>Optional</sup> <a name="insightsVersion" id="cargo-lambda-cdk.RustFunctionProps.property.insightsVersion"></a>

```typescript
public readonly insightsVersion: LambdaInsightsVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.LambdaInsightsVersion
- *Default:* No Lambda Insights

Specify the version of CloudWatch Lambda insights to use for monitoring.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-docker.html](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-docker.html)

---

##### `layers`<sup>Optional</sup> <a name="layers" id="cargo-lambda-cdk.RustFunctionProps.property.layers"></a>

```typescript
public readonly layers: ILayerVersion[];
```

- *Type:* aws-cdk-lib.aws_lambda.ILayerVersion[]
- *Default:* No layers.

A list of layers to add to the function's execution environment.

You can configure your Lambda function to pull in
additional code during initialization in the form of layers. Layers are packages of libraries or other dependencies
that can be used by multiple functions.

---

##### `logRetention`<sup>Optional</sup> <a name="logRetention" id="cargo-lambda-cdk.RustFunctionProps.property.logRetention"></a>

```typescript
public readonly logRetention: RetentionDays;
```

- *Type:* aws-cdk-lib.aws_logs.RetentionDays
- *Default:* logs.RetentionDays.INFINITE

The number of days log events are kept in CloudWatch Logs.

When updating
this property, unsetting it doesn't remove the log retention policy. To
remove the retention policy, set the value to `INFINITE`.

---

##### `logRetentionRetryOptions`<sup>Optional</sup> <a name="logRetentionRetryOptions" id="cargo-lambda-cdk.RustFunctionProps.property.logRetentionRetryOptions"></a>

```typescript
public readonly logRetentionRetryOptions: LogRetentionRetryOptions;
```

- *Type:* aws-cdk-lib.aws_lambda.LogRetentionRetryOptions
- *Default:* Default AWS SDK retry options.

When log retention is specified, a custom resource attempts to create the CloudWatch log group.

These options control the retry policy when interacting with CloudWatch APIs.

---

##### `logRetentionRole`<sup>Optional</sup> <a name="logRetentionRole" id="cargo-lambda-cdk.RustFunctionProps.property.logRetentionRole"></a>

```typescript
public readonly logRetentionRole: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole
- *Default:* A new role is created.

The IAM role for the Lambda function associated with the custom resource that sets the retention policy.

---

##### `memorySize`<sup>Optional</sup> <a name="memorySize" id="cargo-lambda-cdk.RustFunctionProps.property.memorySize"></a>

```typescript
public readonly memorySize: number;
```

- *Type:* number
- *Default:* 128

The amount of memory, in MB, that is allocated to your Lambda function.

Lambda uses this value to proportionally allocate the amount of CPU
power. For more information, see Resource Model in the AWS Lambda
Developer Guide.

---

##### `profiling`<sup>Optional</sup> <a name="profiling" id="cargo-lambda-cdk.RustFunctionProps.property.profiling"></a>

```typescript
public readonly profiling: boolean;
```

- *Type:* boolean
- *Default:* No profiling.

Enable profiling.

> [https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html](https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html)

---

##### `profilingGroup`<sup>Optional</sup> <a name="profilingGroup" id="cargo-lambda-cdk.RustFunctionProps.property.profilingGroup"></a>

```typescript
public readonly profilingGroup: IProfilingGroup;
```

- *Type:* aws-cdk-lib.aws_codeguruprofiler.IProfilingGroup
- *Default:* A new profiling group will be created if `profiling` is set.

Profiling Group.

> [https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html](https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html)

---

##### `reservedConcurrentExecutions`<sup>Optional</sup> <a name="reservedConcurrentExecutions" id="cargo-lambda-cdk.RustFunctionProps.property.reservedConcurrentExecutions"></a>

```typescript
public readonly reservedConcurrentExecutions: number;
```

- *Type:* number
- *Default:* No specific limit - account limit.

The maximum of concurrent executions you want to reserve for the function.

> [https://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html](https://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html)

---

##### `role`<sup>Optional</sup> <a name="role" id="cargo-lambda-cdk.RustFunctionProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole
- *Default:* A unique role will be generated for this lambda function. Both supplied and generated roles can always be changed by calling `addToRolePolicy`.

Lambda execution role.

This is the role that will be assumed by the function upon execution.
It controls the permissions that the function will have. The Role must
be assumable by the 'lambda.amazonaws.com' service principal.

The default Role automatically has permissions granted for Lambda execution. If you
provide a Role, you must add the relevant AWS managed policies yourself.

The relevant managed policies are "service-role/AWSLambdaBasicExecutionRole" and
"service-role/AWSLambdaVPCAccessExecutionRole".

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="cargo-lambda-cdk.RustFunctionProps.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]
- *Default:* If the function is placed within a VPC and a security group is not specified, either by this or securityGroup prop, a dedicated security group will be created for this function.

The list of security groups to associate with the Lambda's network interfaces.

Only used if 'vpc' is supplied.

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="cargo-lambda-cdk.RustFunctionProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.seconds(3)

The function execution time (in seconds) after which Lambda terminates the function.

Because the execution time affects cost, set this value
based on the function's expected execution time.

---

##### `tracing`<sup>Optional</sup> <a name="tracing" id="cargo-lambda-cdk.RustFunctionProps.property.tracing"></a>

```typescript
public readonly tracing: Tracing;
```

- *Type:* aws-cdk-lib.aws_lambda.Tracing
- *Default:* Tracing.Disabled

Enable AWS X-Ray Tracing for Lambda Function.

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="cargo-lambda-cdk.RustFunctionProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc
- *Default:* Function is not placed within a VPC.

VPC network to place Lambda network interfaces.

Specify this if the Lambda function needs to access resources in a VPC.
This is required when `vpcSubnets` is specified.

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="cargo-lambda-cdk.RustFunctionProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* the Vpc default strategy if not specified

Where to place the network interfaces within the VPC.

This requires `vpc` to be specified in order for interfaces to actually be
placed in the subnets. If `vpc` is not specify, this will raise an error.

Note: Internet access for Lambda Functions requires a NAT Gateway, so picking
public subnets is not allowed (unless `allowPublicSubnet` is set to `true`).

---

##### `alwaysClone`<sup>Optional</sup> <a name="alwaysClone" id="cargo-lambda-cdk.RustFunctionProps.property.alwaysClone"></a>

```typescript
public readonly alwaysClone: boolean;
```

- *Type:* boolean
- *Default:* clones only if the repository and branch does not already exist in the temporary directory.

Always clone the repository if using a git `manifestPath`, even if it has already been cloned to the temporary directory.

---

##### `binaryName`<sup>Optional</sup> <a name="binaryName" id="cargo-lambda-cdk.RustFunctionProps.property.binaryName"></a>

```typescript
public readonly binaryName: string;
```

- *Type:* string

The name of the binary to build, in case that's different than the package's name.

---

##### `branch`<sup>Optional</sup> <a name="branch" id="cargo-lambda-cdk.RustFunctionProps.property.branch"></a>

```typescript
public readonly branch: string;
```

- *Type:* string
- *Default:* the default branch, i.e. HEAD.

The branch to clone if the `manifestPath` is a git repository.

---

##### `bundling`<sup>Optional</sup> <a name="bundling" id="cargo-lambda-cdk.RustFunctionProps.property.bundling"></a>

```typescript
public readonly bundling: BundlingOptions;
```

- *Type:* <a href="#cargo-lambda-cdk.BundlingOptions">BundlingOptions</a>
- *Default:* use default bundling options

Bundling options.

---

##### `manifestPath`<sup>Optional</sup> <a name="manifestPath" id="cargo-lambda-cdk.RustFunctionProps.property.manifestPath"></a>

```typescript
public readonly manifestPath: string;
```

- *Type:* string
- *Default:* check the current directory for a `Cargo.toml` file, and throws an error if the file doesn't exist.

Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly.

This will accept a directory path containing a `Cargo.toml` file, a filepath to your
`Cargo.toml` file (i.e. `path/to/Cargo.toml`), or a git repository url
(e.g. `https://github.com/your_user/your_repo`).

When using a git repository URL, the repository will be cloned to a temporary directory.

---

##### `runtime`<sup>Optional</sup> <a name="runtime" id="cargo-lambda-cdk.RustFunctionProps.property.runtime"></a>

```typescript
public readonly runtime: string;
```

- *Type:* string

The Lambda runtime to deploy this function.

`provided.al2023` is the default runtime when this option is not provided.

---


## Protocols <a name="Protocols" id="Protocols"></a>

### ICommandHooks <a name="ICommandHooks" id="cargo-lambda-cdk.ICommandHooks"></a>

- *Implemented By:* <a href="#cargo-lambda-cdk.ICommandHooks">ICommandHooks</a>

Command hooks.

These commands will run in the environment in which bundling occurs: inside
the container for Docker bundling or on the host OS for local bundling.

Commands are chained with `&&`.

```text
{
  // Run tests prior to bundling
  beforeBundling(inputDir: string, outputDir: string): string[] {
    return [`cargo test`];
  }
  // ...
}
```

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cargo-lambda-cdk.ICommandHooks.afterBundling">afterBundling</a></code> | Returns commands to run after bundling. |
| <code><a href="#cargo-lambda-cdk.ICommandHooks.beforeBundling">beforeBundling</a></code> | Returns commands to run before bundling. |

---

##### `afterBundling` <a name="afterBundling" id="cargo-lambda-cdk.ICommandHooks.afterBundling"></a>

```typescript
public afterBundling(inputDir: string, outputDir: string): string[]
```

Returns commands to run after bundling.

Commands are chained with `&&`.

###### `inputDir`<sup>Required</sup> <a name="inputDir" id="cargo-lambda-cdk.ICommandHooks.afterBundling.parameter.inputDir"></a>

- *Type:* string

---

###### `outputDir`<sup>Required</sup> <a name="outputDir" id="cargo-lambda-cdk.ICommandHooks.afterBundling.parameter.outputDir"></a>

- *Type:* string

---

##### `beforeBundling` <a name="beforeBundling" id="cargo-lambda-cdk.ICommandHooks.beforeBundling"></a>

```typescript
public beforeBundling(inputDir: string, outputDir: string): string[]
```

Returns commands to run before bundling.

Commands are chained with `&&`.

###### `inputDir`<sup>Required</sup> <a name="inputDir" id="cargo-lambda-cdk.ICommandHooks.beforeBundling.parameter.inputDir"></a>

- *Type:* string

---

###### `outputDir`<sup>Required</sup> <a name="outputDir" id="cargo-lambda-cdk.ICommandHooks.beforeBundling.parameter.outputDir"></a>

- *Type:* string

---