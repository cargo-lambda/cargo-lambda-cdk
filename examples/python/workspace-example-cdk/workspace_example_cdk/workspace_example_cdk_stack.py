from aws_cdk import (
    CfnOutput,
    Stack,
)
from constructs import Construct
from cargo_lambda_cdk import (
    RustExtension,
    RustFunction,
)
from os import path


class WorkspaceExampleCdkStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        extension = RustExtension(
            self,
            "Rust Extension",
            manifest_path=path.join("..", "..", "rust-workspace", "rust-extension"),
        )

        function = RustFunction(
            self,
            "Rust Function",
            manifest_path=path.join("..", "..", "rust-workspace", "rust-function"),
            layers=[extension],
        )

        CfnOutput(self, "Extension ARN", value=extension.layer_version_arn)
        CfnOutput(self, "Function ARN", value=function.function_arn)
