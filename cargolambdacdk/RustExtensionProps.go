// CDK Construct to build Rust functions with Cargo Lambda
package cargolambdacdk

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
)

type RustExtensionProps struct {
	// The description the this Lambda Layer.
	Description *string `field:"optional" json:"description" yaml:"description"`
	// The name of the layer.
	LayerVersionName *string `field:"optional" json:"layerVersionName" yaml:"layerVersionName"`
	// The SPDX licence identifier or URL to the license file for this layer.
	License *string `field:"optional" json:"license" yaml:"license"`
	// Whether to retain this version of the layer when a new version is added or when the stack is deleted.
	RemovalPolicy awscdk.RemovalPolicy `field:"optional" json:"removalPolicy" yaml:"removalPolicy"`
	// The name of the binary to build, in case that's different than the package's name.
	BinaryName *string `field:"optional" json:"binaryName" yaml:"binaryName"`
	// Bundling options.
	Bundling *BundlingOptions `field:"optional" json:"bundling" yaml:"bundling"`
	// Path to a directory containing your Cargo.toml file, or to your Cargo.toml directly.
	//
	// This will accept either a directory path containing a `Cargo.toml` file
	// or a filepath to your `Cargo.toml` file (i.e. `path/to/Cargo.toml`).
	ManifestPath *string `field:"optional" json:"manifestPath" yaml:"manifestPath"`
}

