import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RustExtension, RustFunction } from 'cargo-lambda-cdk';

const BASE_PATH = path.join(__dirname, '..', '..', '..', 'rust-workspace');

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const extension = new RustExtension(this, 'rust-extension', {
      manifestPath: path.join(BASE_PATH, 'rust-extension')
    });

    const func = new RustFunction(this, 'rust-function', {
      manifestPath: path.join(BASE_PATH, 'rust-function'),
      layers: [
        extension
      ]
    });

    new cdk.CfnOutput(this, 'extension ARN', {
      value: extension.layerVersionArn,
    })

    new cdk.CfnOutput(this, 'function ARN', {
      value: func.functionArn,
    });
  }
}
