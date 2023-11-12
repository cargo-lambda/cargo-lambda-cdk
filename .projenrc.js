const { awscdk } = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'David Calavera',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'cargo-lambda-cdk',
  repositoryUrl: 'https://github.com/cargo-lambda/cargo-lambda-cdk.git',
  description: 'CDK Construct to build Rust functions with Cargo Lambda',
  githubOptions: {
    workflows: false,
  },
  license: 'MIT',
  publishToGo: {
    moduleName: 'github.com/cargo-lambda/cargo-lambda-cdk',
  },
  publishToMaven: {
    mavenServerId: 'github',
    mavenRepositoryUrl: 'https://maven.pkg.github.com/cargo-lambda/cargo-lambda-cdk',
    mavenEndpoint: 'https://maven.pkg.github.com',
    javaPackage: 'com.cargolambda.cargo_lambda_cdk',
    mavenArtifactId: 'cargo_lambda_cdk',
    mavenGroupId: 'com.cargolambda',
  },
  publishToNuget: {
    dotNetNamespace: 'CargoLambda.CDK',
    packageId: 'CargoLambda.CargoLambdaCDK',
  },
  publishToPypi: {
    distName: 'cargo-lambda-cdk',
    module: 'cargo_lambda_cdk',
  },
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflow: false,
  },
});

project.addBundledDeps('js-toml@^0.1.1');

project.addGitIgnore('target');
project.gitignore.removePatterns('*.tgz');
project.synth();
