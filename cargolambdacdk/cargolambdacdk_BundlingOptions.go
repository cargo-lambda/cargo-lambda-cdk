// CDK Construct to build Rust functions with Cargo Lambda
package cargolambdacdk

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awslambda"
)

// Bundling options.
type BundlingOptions struct {
	// The system architecture of the lambda function.
	Architecture awslambda.Architecture `field:"optional" json:"architecture" yaml:"architecture"`
	// Specify a custom hash for this asset.
	//
	// If `assetHashType` is set it must
	// be set to `AssetHashType.CUSTOM`. For consistency, this custom hash will
	// be SHA256 hashed and encoded as hex. The resulting hash will be the asset
	// hash.
	//
	// NOTE: the hash is used in order to identify a specific revision of the asset, and
	// used for optimizing and caching deployment activities related to this asset such as
	// packaging, uploading to Amazon S3, etc. If you chose to customize the hash, you will
	// need to make sure it is updated every time the asset changes, or otherwise it is
	// possible that some deployments will not be invalidated.
	AssetHash *string `field:"optional" json:"assetHash" yaml:"assetHash"`
	// Determines how the asset hash is calculated.
	//
	// Assets will
	// get rebuilt and uploaded only if their hash has changed.
	AssetHashType awscdk.AssetHashType `field:"optional" json:"assetHashType" yaml:"assetHashType"`
	// Command hooks.
	CommandHooks ICommandHooks `field:"optional" json:"commandHooks" yaml:"commandHooks"`
	// A custom bundling Docker image.
	DockerImage awscdk.DockerImage `field:"optional" json:"dockerImage" yaml:"dockerImage"`
	// Environment variables defined when Cargo runs.
	Environment *map[string]*string `field:"optional" json:"environment" yaml:"environment"`
	// Force bundling in a Docker container even if local bundling is possible.
	ForcedDockerBundling *bool `field:"optional" json:"forcedDockerBundling" yaml:"forcedDockerBundling"`
}

