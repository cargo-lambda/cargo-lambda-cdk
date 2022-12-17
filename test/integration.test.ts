import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import * as cargoLambda from '../lib/index';

describe('CargoLambda.RustFunction', () => {

  const app = new cdk.App();
  const stack = new cdk.Stack(app);

  describe('With single package Cargo project', () => {
    const testSource = path.join(__dirname, 'fixtures/single-package');

    new cargoLambda.RustFunction(stack, 'single-package', {
      manifestPath: testSource,
      bundling: {
        forcedDockerBundling: true,
      },
    });

    test('bundle function', () => {
      app.synth();
    });
  });

  describe('With a Cargo workspace', () => {
    const testSource = path.join(__dirname, 'fixtures/cargo-workspace');

    new cargoLambda.RustFunction(stack, 'binary1', {
      manifestPath: path.join(testSource, 'binary1'),
      binaryName: 'binary1',
      bundling: {
        forcedDockerBundling: true,
      },
    });


    new cargoLambda.RustFunction(stack, 'binary2', {
      manifestPath: path.join(testSource, 'binary2'),
      binaryName: 'binary2',
      bundling: {
        forcedDockerBundling: true,
      },
    });

    test('bundle function', () => {
      app.synth();
    });
  });
});