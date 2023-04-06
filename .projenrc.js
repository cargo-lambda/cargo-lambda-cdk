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
  // publishToMaven: {
  //   javaPackage: 'com.cargolambda.cargo_lambda_cdk',
  //   mavenArtifactId: 'cargo_lambda_cdk',
  //   mavenGroupId: 'com.cargolambda',
  // },
  publishToNuget: {
    dotNetNamespace: 'CargoLambda.CDK',
    packageId: 'CargoLambda.CargoLambdaCDK',
  },
  publishToPypi: {
    distName: 'cargo-lambda-cdk',
    module: 'cargo_lambda_cdk',
  },
});

project.addGitIgnore('target');
project.synth();
