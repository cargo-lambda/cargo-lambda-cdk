import * as path from 'path';
import { env } from 'process';
import * as cdk from 'aws-cdk-lib/core';
import { RustFunction, cargoLambdaVersion } from '../lib/index';

describe('CargoLambda.RustFunction', () => {

  const app = new cdk.App();
  const stack = new cdk.Stack(app);
  const forcedDockerBundling = !!env.FORCE_DOCKER_RUN || !cargoLambdaVersion();

  describe('With single package Cargo project', () => {
    const testSource = path.join(__dirname, 'fixtures/single-package');

    new RustFunction(stack, 'single-package', {
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
    const testSource = path.join(__dirname, 'fixtures/cargo-workspace');

    new RustFunction(stack, 'binary1', {
      manifestPath: path.join(testSource, 'binary1'),
      binaryName: 'binary1',
      bundling: {
        forcedDockerBundling,
      },
    });


    new RustFunction(stack, 'binary2', {
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