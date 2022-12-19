import { existsSync } from 'fs';
import { join, parse } from 'path';

export function getCargoManifestPath(manifestPath: string): string {
  // const manifestPathProp = props.manifestPath ?? 'Cargo.toml';
  const parsedManifestPath = parse(manifestPath);
  let manifestPathResult: string;

  if (parsedManifestPath.base && parsedManifestPath.ext && parsedManifestPath.base === 'Cargo.toml') {
    if (!existsSync(manifestPath)) {
      throw new Error('Cargo.toml doesn\'t exist');
    }
    manifestPathResult = manifestPath;
  } else if (parsedManifestPath.base && parsedManifestPath.ext && parsedManifestPath.base != 'Cargo.toml') {
    throw new Error('manifestPath is specifying a file that is not Cargo.toml');
  } else if (!existsSync(join(manifestPath, 'Cargo.toml'))) {
    throw new Error(`Cargo.toml file at ${manifestPath} doesn't exist`);
  } else {
    manifestPathResult = join(manifestPath, 'Cargo.toml');
  }

  return manifestPathResult;
}