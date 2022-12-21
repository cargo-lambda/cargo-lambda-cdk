import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RustExtension, RustFunction } from 'cargo-lambda-cdk';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const extension = new RustExtension(this, 'rust-extension', {
      manifestPath: path.join(__dirname, '..', '..', 'rust-extension')
    });

    const func = new RustFunction(this, 'rust-function', {
      manifestPath: path.join(__dirname, '..', '..', 'rust-function'),
      layers: [
        extension
      ]
    });

    new cdk.CfnOutput(this, 'function name', {
      value: func.functionName,
    });
  }
}
