package cargolambdacdk

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
)

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
	// The name of the binary to build, in case that's different than the package's name.
	BinaryName *string `field:"optional" json:"binaryName" yaml:"binaryName"`
	// Bundling options.
	// Default: - use default bundling options.
	//
	Bundling *BundlingOptions `field:"optional" json:"bundling" yaml:"bundling"`
	// Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly.
	//
	// This will accept either a directory path containing a `Cargo.toml` file
	// or a filepath to your `Cargo.toml` file (i.e. `path/to/Cargo.toml`).
	// Default: - check the current directory for a `Cargo.toml` file, and throws
	// an error if the file doesn't exist.
	//
	ManifestPath *string `field:"optional" json:"manifestPath" yaml:"manifestPath"`
}

