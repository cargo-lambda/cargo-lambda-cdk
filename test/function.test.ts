import { join } from 'path';
import { env } from 'process';
import { App, Stack } from 'aws-cdk-lib';
import { RustFunction, cargoLambdaVersion } from '../src/index';

const forcedDockerBundling = !!env.FORCE_DOCKER_RUN || !cargoLambdaVersion();

describe('CargoLambda.RustFunction', () => {
  describe('With single package Cargo project', () => {
    const app = new App();
    const stack = new Stack(app);
    const testSource = join(__dirname, 'fixtures/single-package');

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
    const app = new App();
    const stack = new Stack(app);
    const testSource = join(__dirname, 'fixtures/cargo-workspace');

    new RustFunction(stack, 'rust function 1', {
      manifestPath: join(testSource, 'binary1'),
      binaryName: 'binary1',
      bundling: {
        forcedDockerBundling,
      },
    });

    new RustFunction(stack, 'rust function 2', {
      manifestPath: join(testSource, 'binary2'),
      binaryName: 'binary2',
      bundling: {
        forcedDockerBundling,
      },
    });

    test('bundle function', () => {
      app.synth();
    });
  });

  describe('With the legacy provided.al2 runtime', () => {
    const app = new App();
    const stack = new Stack(app);
    const testSource = join(__dirname, 'fixtures/single-package');

    new RustFunction(stack, 'rust function', {
      manifestPath: testSource,
      runtime: 'provided.al2',
      bundling: {
        forcedDockerBundling,
      },
    });

    test('bundle function', () => {
      app.synth();
    });
  });
});
