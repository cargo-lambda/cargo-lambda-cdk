package cargolambdacdk

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awslambda"
)

// Properties for a RustExtension.
type RustExtensionProps struct {
	// The description the this Lambda Layer.
	// Default: - No description.
	//
	Description *string `field:"optional" json:"description" yaml:"description"`
	// The name of the layer.
	// Default: - A name will be generated.
	//
	LayerVersionName *string `field:"optional" json:"layerVersionName" yaml:"layerVersionName"`
	// The SPDX licence identifier or URL to the license file for this layer.
	// Default: - No license information will be recorded.
	//
	License *string `field:"optional" json:"license" yaml:"license"`
	// Whether to retain this version of the layer when a new version is added or when the stack is deleted.
	// Default: RemovalPolicy.DESTROY
	//
	RemovalPolicy awscdk.RemovalPolicy `field:"optional" json:"removalPolicy" yaml:"removalPolicy"`
	// The system architecture of the lambda extension.
	// Default: - Architecture.X86_64
	//
	Architecture awslambda.Architecture `field:"optional" json:"architecture" yaml:"architecture"`
	// The name of the binary to build, in case that's different than the package's name.
	BinaryName *string `field:"optional" json:"binaryName" yaml:"binaryName"`
	// Bundling options.
	// Default: - use default bundling options.
	//
	Bundling *BundlingOptions `field:"optional" json:"bundling" yaml:"bundling"`
	// Always clone the repository if using the `gitRemote` option, even if it has already been cloned to the temporary directory.
	// Default: - clones only if the repository and reference don't already exist in the
	// temporary directory.
	//
	GitForceClone *bool `field:"optional" json:"gitForceClone" yaml:"gitForceClone"`
	// The git reference to checkout. This can be a branch, tag, or commit hash.
	//
	// If this option is not provided, `git clone` will run with the flag `--depth 1`.
	// Default: - the default branch, i.e. HEAD.
	//
	GitReference *string `field:"optional" json:"gitReference" yaml:"gitReference"`
	// The git remote URL to clone (e.g `https://github.com/your_user/your_repo`).
	//
	// This repository will be cloned to a temporary directory using `git`.
	// The `git` command must be available in the PATH.
	GitRemote *string `field:"optional" json:"gitRemote" yaml:"gitRemote"`
	// Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly.
	//
	// This will accept a directory path containing a `Cargo.toml` file (i.e. `path/to/package`), or a filepath to your
	// `Cargo.toml` file (i.e. `path/to/Cargo.toml`). When the `gitRemote` option is provided,
	// the `manifestPath` is relative to the root of the git repository.
	// Default: - check the current directory for a `Cargo.toml` file, and throws
	// an error if the file doesn't exist.
	//
	ManifestPath *string `field:"optional" json:"manifestPath" yaml:"manifestPath"`
}

