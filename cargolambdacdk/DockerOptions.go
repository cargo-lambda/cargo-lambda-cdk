package cargolambdacdk

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
)

// Additional docker options when using docker bundling.
//
// Default values here inherit
// from `cdk.BundlingOptions`.
type DockerOptions struct {
	// The access mechanism used to make source files available to the bundling container and to return the bundling output back to the host.
	// Default: - BundlingFileAccess.BIND_MOUNT
	//
	BundlingFileAccess awscdk.BundlingFileAccess `field:"optional" json:"bundlingFileAccess" yaml:"bundlingFileAccess"`
	// The command to run in the Docker container.
	//
	// This is normally controlled by the `RustFunction`
	// but can be overridden here.
	// Default: - a cargo lambda compilation.
	//
	Command *[]*string `field:"optional" json:"command" yaml:"command"`
	// The entrypoint to run in the Docker container.
	// See: https://docs.docker.com/engine/reference/builder/#entrypoint
	//
	// Default: - run the entrypoint defined in the image.
	//
	Entrypoint *[]*string `field:"optional" json:"entrypoint" yaml:"entrypoint"`
	// Local bundling provider.
	//
	// This is normally controlled by the `RustFunction`
	// but can be overridden here.
	// Default: - bundling will be performed locally if Rust and cargo-lambda are
	// installed and `forcedDockerBundling` is not true, otherwise it will be performed
	// in the docker container.
	//
	Local awscdk.ILocalBundling `field:"optional" json:"local" yaml:"local"`
	// Docker [Networking options](https://docs.docker.com/engine/reference/commandline/run/#connect-a-container-to-a-network---network).
	// Default: - no networking options.
	//
	Network *string `field:"optional" json:"network" yaml:"network"`
	// The type of output that this bundling operation is producing.
	// Default: BundlingOutput.AUTO_DISCOVER
	//
	OutputType awscdk.BundlingOutput `field:"optional" json:"outputType" yaml:"outputType"`
	// [Security configuration](https://docs.docker.com/engine/reference/run/#security-configuration) when running the docker container.
	// Default: - no security options.
	//
	SecurityOpt *string `field:"optional" json:"securityOpt" yaml:"securityOpt"`
	// The user to use when running the Docker container.
	//
	// user | user:group | uid | uid:gid | user:gid | uid:group.
	// See: https://docs.docker.com/engine/reference/run/#user
	//
	// Default: - uid:gid of the current user or 1000:1000 on Windows.
	//
	User *string `field:"optional" json:"user" yaml:"user"`
	// Additional Docker volumes to mount.
	// Default: - no additional volumes are mounted.
	//
	Volumes *[]*awscdk.DockerVolume `field:"optional" json:"volumes" yaml:"volumes"`
	// Where to mount the specified volumes from.
	// See: https://docs.docker.com/engine/reference/commandline/run/#mount-volumes-from-container---volumes-from
	//
	// Default: - no containers are specified to mount volumes from.
	//
	VolumesFrom *[]*string `field:"optional" json:"volumesFrom" yaml:"volumesFrom"`
	// Working directory inside the Docker container.
	// Default: /asset-input.
	//
	WorkingDirectory *string `field:"optional" json:"workingDirectory" yaml:"workingDirectory"`
}

