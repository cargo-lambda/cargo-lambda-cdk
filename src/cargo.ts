import { mkdirSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { join, parse } from 'node:path';
import { tmpdir } from 'os';
import { load } from 'js-toml';
import { BundlingOptions } from './types';
import { exec } from './util';

/**
 * Base properties for a Cargo project.
 *
 * RustFunctionProps and RustExtensionProps cannot inherit from this interface
 * because jsii only supports direct inheritance from a single interface.
 */
interface CargoProject {
  readonly bundling?: BundlingOptions;
  readonly binaryName?: string;
  readonly manifestPath?: string;
  readonly gitRemote?: string;
  readonly gitReference?: string;
  readonly gitForceClone?: boolean;
}

export interface Workspace {
  members: string[];
}

export interface Package {
  name: string;
}

export interface Manifest {
  package?: Package;
  bin?: Package[];
  workspace?: Workspace;
}

export function getManifestPath(project: CargoProject): string {
  const defaultManifestPath = project.manifestPath || 'Cargo.toml';
  let manifestPath = defaultManifestPath;

  // Determine what type of URL this is and download (git repo) locally
  if (project.gitRemote && isValidGitUrl(project.gitRemote)) {
    const gitReference = project.gitReference || 'HEAD';

    // i.e: 3ed81b4751e8f09bfa39fe743ee143df60304db5        HEAD
    let latestCommit = exec('git', ['ls-remote', project.gitRemote, gitReference]).stdout.toString().split(/(\s+)/)[0];
    const localPath = join(tmpdir(), latestCommit);

    if (project.gitForceClone) {
      rmSync(localPath, { recursive: true, force: true });
    }

    if (!existsSync(localPath)) {
      mkdirSync(localPath, { recursive: true });

      const args = ['clone'];
      if (gitReference === 'HEAD') {
        args.push('--depth', '1');
      }

      args.push(project.gitRemote, localPath);
      exec('git', args);

      if (gitReference !== 'HEAD') {
        exec('git', ['checkout', gitReference], { cwd: localPath });
      }
    }

    // Append Cargo.toml to the path
    manifestPath = join(localPath, defaultManifestPath);
  }

  let manifestPathResult;
  let parsedManifestPath = parse(manifestPath);

  if (parsedManifestPath.base && parsedManifestPath.ext && parsedManifestPath.base === 'Cargo.toml') {
    manifestPathResult = manifestPath;
  } else if (parsedManifestPath.base && parsedManifestPath.ext && parsedManifestPath.base != 'Cargo.toml') {
    throw new Error('manifestPath is specifying a file that is not Cargo.toml');
  } else {
    manifestPathResult = join(manifestPath, 'Cargo.toml');
  }

  if (!existsSync(manifestPathResult)) {
    throw new Error(`'${manifestPathResult}' is not a path to a Cargo.toml file, use the option \`manifestPath\` to specify the location of the Cargo.toml file`);
  }

  return manifestPathResult;
}

function isValidGitUrl(url: string): boolean {
  const httpsRegex = /^https:\/\/[\w.-]+(:\d+)?\/[\w.-]+\/[\w.-]+(\.git)?$/;
  const sshRegex = /^ssh:\/\/[\w.-]+@[\w.-]+(:\d+)?\/[\w.-]+\/[\w.-]+(\.git)?$/;
  const gitSshRegex = /^git@[\w.-]+:[\w.-]+\/[\w.-]+(\.git)?$/;

  return httpsRegex.test(url) || sshRegex.test(url) || gitSshRegex.test(url);
}

export function getManifest(manifestPath: string): Manifest {
  const data = readFileSync(manifestPath);
  return load(data.toString('utf-8')) as Manifest;
}
