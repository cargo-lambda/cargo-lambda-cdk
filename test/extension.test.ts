import { join } from 'path';
import { env } from 'process';
import { App, Stack } from 'aws-cdk-lib';
import { RustExtension, cargoLambdaVersion } from '../src/index';

const forcedDockerBundling = !!env.FORCE_DOCKER_RUN || !cargoLambdaVersion();

describe('CargoLambda.RustExtension', () => {
  describe('With single package Cargo project', () => {
    const app = new App();
    const stack = new Stack(app);
    const testSource = join(__dirname, 'fixtures/single-package');

    new RustExtension(stack, 'rust extension', {
      manifestPath: testSource,
      bundling: {
        forcedDockerBundling,
      },
    });

    test('bundle extension', () => {
      app.synth();
    });
  });

  describe('With a Cargo workspace', () => {
    const app = new App();
    const stack = new Stack(app);
    const testSource = join(__dirname, 'fixtures/cargo-workspace');

    new RustExtension(stack, 'rust extension 1', {
      manifestPath: join(testSource, 'binary1'),
      binaryName: 'binary1',
      bundling: {
        forcedDockerBundling,
      },
    });

    new RustExtension(stack, 'rust extension 2', {
      manifestPath: join(testSource, 'binary2'),
      binaryName: 'binary2',
      bundling: {
        forcedDockerBundling,
      },
    });

    test('bundle extension', () => {
      app.synth();
    });
  });
});