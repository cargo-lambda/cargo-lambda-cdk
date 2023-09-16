import { existsSync, readFileSync } from 'node:fs';
import { join, parse } from 'node:path';
import { load } from 'js-toml';

interface Workspace {
  members: string[];
}

interface Package {
  name: string;
}

interface Manifest {
  package?: Package;
  bin?: Package[];
  workspace?: Workspace;
}

export function getManifestPath(manifestPath: string): string {
  // const manifestPathProp = props.manifestPath ?? 'Cargo.toml';
  const parsedManifestPath = parse(manifestPath);
  let manifestPathResult: string;

  if (parsedManifestPath.base && parsedManifestPath.ext && parsedManifestPath.base === 'Cargo.toml') {
    manifestPathResult = manifestPath;
  } else if (parsedManifestPath.base && parsedManifestPath.ext && parsedManifestPath.base != 'Cargo.toml') {
    throw new Error('manifestPath is specifying a file that is not Cargo.toml');
  } else {
    manifestPathResult = join(manifestPath, 'Cargo.toml');
  }

  if (!existsSync(manifestPathResult)) {
    throw new Error('Cargo.toml doesn\'t exist, use the option `manifestPath` to specify the location of the Cargo.toml file');
  }

  return manifestPathResult;
}

export function getManifest(manifestPath: string): Manifest {
  const data = readFileSync(manifestPath);
  return load(data.toString('utf-8')) as Manifest;
}