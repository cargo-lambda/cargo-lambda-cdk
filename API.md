# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### RustFunction <a name="RustFunction" id="cargo-lambda-cdk.RustFunction"></a>

A Rust Lambda function.

#### Initializers <a name="Initializers" id="cargo-lambda-cdk.RustFunction.Initializer"></a>

```typescript
import { RustFunction } from 'cargo-lambda-cdk'

new RustFunction(scope: Construct, packageName: string, props?: RustFunctionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cargo-lambda-cdk.RustFunction.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cargo-lambda-cdk.RustFunction.Initializer.parameter.packageName">packageName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cargo-lambda-cdk.RustFunction.Initializer.parameter.props">props</a></code> | <code><a href="#cargo-lambda-cdk.RustFunctionProps">RustFunctionProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cargo-lambda-cdk.RustFunction.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `packageName`<sup>Required</sup> <a name="packageName" id="cargo-lambda-cdk.RustFunction.Initializer.parameter.packageName"></a>

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
| <code><a href="#cargo-lambda-cdk.RustFunction.addPermission">addPermission</a></code> | Adds a permission to the Lambda resource policy. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addToRolePolicy">addToRolePolicy</a></code> | Adds a statement to the IAM role assumed by the instance. |
| <code><a href="#cargo-lambda-cdk.RustFunction.configureAsyncInvoke">configureAsyncInvoke</a></code> | Configures options for asynchronous invocation. |
| <code><a href="#cargo-lambda-cdk.RustFunction.grantInvoke">grantInvoke</a></code> | Grant the given identity permissions to invoke this Lambda. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metric">metric</a></code> | Return the given named metric for this Function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricDuration">metricDuration</a></code> | How long execution of this Lambda takes. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricErrors">metricErrors</a></code> | How many invocations of this Lambda fail. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricInvocations">metricInvocations</a></code> | How often this Lambda is invoked. |
| <code><a href="#cargo-lambda-cdk.RustFunction.metricThrottles">metricThrottles</a></code> | How often this Lambda is throttled. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addEnvironment">addEnvironment</a></code> | Adds an environment variable to this Lambda function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.addLayers">addLayers</a></code> | Adds one or more Lambda Layers to this Lambda function. |

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

##### `grantInvoke` <a name="grantInvoke" id="cargo-lambda-cdk.RustFunction.grantInvoke"></a>

```typescript
public grantInvoke(grantee: IGrantable): Grant
```

Grant the given identity permissions to invoke this Lambda.

###### `grantee`<sup>Required</sup> <a name="grantee" id="cargo-lambda-cdk.RustFunction.grantInvoke.parameter.grantee"></a>

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
public addLayers(layers: ILayerVersion): void
```

Adds one or more Lambda Layers to this Lambda function.

###### `layers`<sup>Required</sup> <a name="layers" id="cargo-lambda-cdk.RustFunction.addLayers.parameter.layers"></a>

- *Type:* aws-cdk-lib.aws_lambda.ILayerVersion

the layers to be added.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cargo-lambda-cdk.RustFunction.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cargo-lambda-cdk.RustFunction.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#cargo-lambda-cdk.RustFunction.classifyVersionProperty">classifyVersionProperty</a></code> | Record whether specific properties in the `AWS::Lambda::Function` resource should also be associated to the Version resource. |
| <code><a href="#cargo-lambda-cdk.RustFunction.fromFunctionArn">fromFunctionArn</a></code> | Import a lambda function into the CDK using its ARN. |
| <code><a href="#cargo-lambda-cdk.RustFunction.fromFunctionAttributes">fromFunctionAttributes</a></code> | Creates a Lambda function object which represents a function not defined within this stack. |
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
| <code><a href="#cargo-lambda-cdk.RustFunction.property.connections">connections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | Access the Connections object. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.functionArn">functionArn</a></code> | <code>string</code> | ARN of this function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.functionName">functionName</a></code> | <code>string</code> | Name of this function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.grantPrincipal">grantPrincipal</a></code> | <code>aws-cdk-lib.aws_iam.IPrincipal</code> | The principal this Lambda Function is running as. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.isBoundToVpc">isBoundToVpc</a></code> | <code>boolean</code> | Whether or not this Lambda function was bound to a VPC. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.latestVersion">latestVersion</a></code> | <code>aws-cdk-lib.aws_lambda.IVersion</code> | The `$LATEST` version of this function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.permissionsNode">permissionsNode</a></code> | <code>constructs.Node</code> | The construct node where permissions are attached. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | Execution role associated with this function. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | The architecture of this Lambda Function (this is an optional attribute and defaults to X86_64). |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.currentVersion">currentVersion</a></code> | <code>aws-cdk-lib.aws_lambda.Version</code> | Returns a `lambda.Version` which represents the current version of this Lambda function. A new version will be created every time the function's configuration changes. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.deadLetterQueue">deadLetterQueue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The DLQ associated with this Lambda Function (this is an optional attribute). |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | The LogGroup where the Lambda function's logs are made available. |
| <code><a href="#cargo-lambda-cdk.RustFunction.property.runtime">runtime</a></code> | <code>aws-cdk-lib.aws_lambda.Runtime</code> | The runtime configured for this lambda. |
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

##### `role`<sup>Optional</sup> <a name="role" id="cargo-lambda-cdk.RustFunction.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

Execution role associated with this function.

---

##### `architecture`<sup>Optional</sup> <a name="architecture" id="cargo-lambda-cdk.RustFunction.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* aws-cdk-lib.aws_lambda.Architecture

The architecture of this Lambda Function (this is an optional attribute and defaults to X86_64).

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

##### `deadLetterQueue`<sup>Optional</sup> <a name="deadLetterQueue" id="cargo-lambda-cdk.RustFunction.property.deadLetterQueue"></a>

```typescript
public readonly deadLetterQueue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue

The DLQ associated with this Lambda Function (this is an optional attribute).

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
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.commandHooks">commandHooks</a></code> | <code><a href="#cargo-lambda-cdk.ICommandHooks">ICommandHooks</a></code> | Command hooks. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.dockerImage">dockerImage</a></code> | <code>aws-cdk-lib.DockerImage</code> | A custom bundling Docker image. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.environment">environment</a></code> | <code>{[ key: string ]: string}</code> | Environment variables defined when Cargo runs. |
| <code><a href="#cargo-lambda-cdk.BundlingOptions.property.forcedDockerBundling">forcedDockerBundling</a></code> | <code>boolean</code> | Force bundling in a Docker container even if local bundling is possible. |

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
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.allowAllOutbound">allowAllOutbound</a></code> | <code>boolean</code> | Whether to allow the Lambda to send all network traffic. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.allowPublicSubnet">allowPublicSubnet</a></code> | <code>boolean</code> | Lambda Functions in a public subnet can NOT access the internet. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | The system architectures compatible with this lambda function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.codeSigningConfig">codeSigningConfig</a></code> | <code>aws-cdk-lib.aws_lambda.ICodeSigningConfig</code> | Code signing config associated with this function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.currentVersionOptions">currentVersionOptions</a></code> | <code>aws-cdk-lib.aws_lambda.VersionOptions</code> | Options for the `lambda.Version` resource automatically created by the `fn.currentVersion` method. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.deadLetterQueue">deadLetterQueue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The SQS queue to use if DLQ is enabled. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.deadLetterQueueEnabled">deadLetterQueueEnabled</a></code> | <code>boolean</code> | Enabled DLQ. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.description">description</a></code> | <code>string</code> | A description of the function. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.environment">environment</a></code> | <code>{[ key: string ]: string}</code> | Key-value pairs that Lambda caches and makes available for your Lambda functions. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.environmentEncryption">environmentEncryption</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | The AWS KMS key that's used to encrypt your function's environment variables. |
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
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.binaryName">binaryName</a></code> | <code>string</code> | The name of the binary to build, in case that's different than the package's name. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.bundling">bundling</a></code> | <code><a href="#cargo-lambda-cdk.BundlingOptions">BundlingOptions</a></code> | Bundling options. |
| <code><a href="#cargo-lambda-cdk.RustFunctionProps.property.manifestPath">manifestPath</a></code> | <code>string</code> | Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly. |

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

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="cargo-lambda-cdk.RustFunctionProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* the Vpc default strategy if not specified

Where to place the network interfaces within the VPC.

Only used if 'vpc' is supplied. Note: internet access for Lambdas
requires a NAT gateway, so picking Public subnets is not allowed.

---

##### `binaryName`<sup>Optional</sup> <a name="binaryName" id="cargo-lambda-cdk.RustFunctionProps.property.binaryName"></a>

```typescript
public readonly binaryName: string;
```

- *Type:* string

The name of the binary to build, in case that's different than the package's name.

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

This will accept either a directory path containing a `Cargo.toml` file
or a filepath to your `Cargo.toml` file (i.e. `path/to/Cargo.toml`).

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


