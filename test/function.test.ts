import * as path from 'path';
import { env } from 'process';
import * as cdk from 'aws-cdk-lib/core';
import { RustFunction, cargoLambdaVersion } from '../src/index';

const forcedDockerBundling = !!env.FORCE_DOCKER_RUN || !cargoLambdaVersion();

describe('CargoLambda.RustFunction', () => {
  describe('With single package Cargo project', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const testSource = path.join(__dirname, 'fixtures/single-package');

    new RustFunction(stack, 'rust function', {
      manifestPath: testSource,
      bundling: {
        forcedDockerBundling,
      },
    });

    test('bundle function', () => {
      app.synth();
    });
  });

  describe('With a Cargo workspace', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const testSource = path.join(__dirname, 'fixtures/cargo-workspace');

    new RustFunction(stack, 'rust function 1', {
      manifestPath: path.join(testSource, 'binary1'),
      binaryName: 'binary1',
      bundling: {
        forcedDockerBundling,
      },
    });

    new RustFunction(stack, 'rust function 2', {
      manifestPath: path.join(testSource, 'binary2'),
      binaryName: 'binary2',
      bundling: {
        forcedDockerBundling,
      },
    });

    test('bundle function', () => {
      app.synth();
    });
  });
});
