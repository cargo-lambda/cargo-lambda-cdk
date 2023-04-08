import * as lambda from 'aws-cdk-lib/aws-lambda';
import { bundlingOptionsFromRustFunctionProps } from '../src/util';

describe('bundlingOptionsFromRustFunctionProps', () => {
  describe('architecture', () => {
    it('uses `X86_64` when no props are given', () => {
      expect(bundlingOptionsFromRustFunctionProps().architecture).toEqual(lambda.Architecture.X86_64);
    });

    it('uses `X86_64` when no props regarding architecture are given', () => {
      expect(bundlingOptionsFromRustFunctionProps({ bundling: {} }).architecture).toEqual(lambda.Architecture.X86_64);
    });

    it('uses the `RustFunctionProps.architecture` when set', () => {
      expect(
        bundlingOptionsFromRustFunctionProps({
          architecture: lambda.Architecture.ARM_64,
        }).architecture,
      ).toEqual(lambda.Architecture.ARM_64);
    });

    it('uses the `BundlingOptions.architecture` when set', () => {
      expect(
        bundlingOptionsFromRustFunctionProps({
          bundling: { architecture: lambda.Architecture.ARM_64 },
        }).architecture,
      ).toEqual(lambda.Architecture.ARM_64);
    });

    it('throws an error when there is an architecture mismatch', () => {
      expect(
        () =>
          bundlingOptionsFromRustFunctionProps({
            architecture: lambda.Architecture.X86_64,
            bundling: { architecture: lambda.Architecture.ARM_64 },
          }).architecture,
      ).toThrow(
        "Architecture mismatch: the architecture for bundling (arm64 ) didn't match the architecture of the underlying lambda (x86_64).",
      );
    });
  });
});
