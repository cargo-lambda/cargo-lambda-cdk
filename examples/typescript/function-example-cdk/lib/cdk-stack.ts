import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RustFunction } from 'cargo-lambda-cdk';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const func = new RustFunction(this, 'Rust Function', {
      manifestPath: path.join(__dirname, '..', '..', '..', 'rust-function')
    });

    new cdk.CfnOutput(this, 'function ARN', {
      value: func.functionArn,
    });
  }
}
