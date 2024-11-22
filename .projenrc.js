const { awscdk } = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'David Calavera',
  cdkVersion: '2.63.0',
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

project.addDevDeps('aws-cdk-lib@^2');
project.addDevDeps('jsii@5.x');
project.addDevDeps('jsii-rosetta@5.x');
project.addDevDeps('typescript@5.x');
project.addDevDeps('@types/node@^18');
project.addDevDeps('jest@^29');
project.addDevDeps('ts-jest@^29');
project.addBundledDeps('js-toml@^0.1.1');

project.addGitIgnore('target');
project.gitignore.removePatterns('*.tgz');

project.npmignore.exclude('examples');
project.npmignore.exclude('cargolambdacdk');

const testTask = project.tasks.tryFind('test');
if (testTask) {
  testTask.reset();
  testTask.exec('jest --passWithNoTests --updateSnapshot --verbose --runInBand', { receiveArgs: true });
  testTask.spawn(project.tasks.tryFind('eslint'));
}

project.synth();
