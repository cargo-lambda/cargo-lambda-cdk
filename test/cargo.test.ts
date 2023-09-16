import { join } from 'node:path';
import { getManifest, getManifestPath } from '../src/cargo';

describe('getManifestPath', () => {
  it('works with a path to an existent Cargo.toml file', () => {
    const fixture = join(__dirname, 'fixtures/single-package/Cargo.toml');
    expect(getManifestPath(fixture)).toEqual(fixture);
  });

  it('works with a base directory', () => {
    const fixture = join(__dirname, 'fixtures/single-package');
    expect(getManifestPath(fixture)).toEqual(join(fixture, 'Cargo.toml'));
  });

  it('fails with a different file', () => {
    const fixture = join(__dirname, 'fixtures/single-package/src/main.rs');
    expect(() => getManifestPath(fixture)).toThrow('manifestPath is specifying a file that is not Cargo.toml');
  });

  it('fails with a directory that doesn\'t include a Cargo.toml file', () => {
    const fixture = join(__dirname, 'fixtures/single-package/src');
    expect(() => getManifestPath(fixture)).toThrow(`'${fixture}/Cargo.toml' is not a path to a Cargo.toml file, use the option \`manifestPath\` to specify the location of the Cargo.toml file`);
  });
});

describe('getManifest', () => {
  it('reads simple manifest files', () => {
    const fixture = join(__dirname, 'fixtures/single-package/Cargo.toml');
    const manifest = getManifest(fixture);
    expect(manifest.package?.name).toEqual('simple-package');
    expect(manifest.bin).toBeUndefined();
    expect(manifest.workspace).toBeUndefined();
  });

  it('reads workspace files', () => {
    const fixture = join(__dirname, 'fixtures/cargo-workspace/Cargo.toml');
    const manifest = getManifest(fixture);
    expect(manifest.package).toBeUndefined();
    expect(manifest.bin).toBeUndefined();
    expect(manifest.workspace?.members).toEqual(['binary1', 'binary2']);
  });

  it('reads binary sections', () => {
    const fixture = join(__dirname, 'fixtures/cargo-workspace/binary1/Cargo.toml');
    const manifest = getManifest(fixture);
    expect(manifest.package?.name).toEqual('binary1');
    expect(manifest.bin && manifest.bin[0].name).toEqual('binary1');
    expect(manifest.workspace).toBeUndefined();
  });
});