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
});

project.addGitIgnore('target');
project.synth();