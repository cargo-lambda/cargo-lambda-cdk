import { spawnSync, SpawnSyncOptions } from 'child_process';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { RustFunctionProps } from './function';
import { BundlingOptions } from './types';

/**
 * Spawn sync with error handling
 */
export function exec(cmd: string, args: string[], options?: SpawnSyncOptions) {
  const proc = spawnSync(cmd, args, options);

  if (proc.error) {
    throw proc.error;
  }

  if (proc.status !== 0) {
    if (proc.stdout || proc.stderr) {
      throw new Error(`[Status ${proc.status}] stdout: ${proc.stdout?.toString().trim()}\n\n\nstderr: ${proc.stderr?.toString().trim()}`);
    }
    throw new Error(`${cmd} exited with status ${proc.status}`);
  }

  return proc;
}

export function bundlingOptionsFromRustFunctionProps(props?: RustFunctionProps): BundlingOptions {
  const architecture = props?.bundling?.architecture
    ? props?.bundling?.architecture
    : props?.architecture
      ? props?.architecture
      : lambda.Architecture.X86_64;
  return {
    ...props?.bundling,
    architecture,
  };
}
