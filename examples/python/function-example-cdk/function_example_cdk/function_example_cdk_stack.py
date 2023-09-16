from aws_cdk import (
    CfnOutput,
    Stack,
)
from constructs import Construct
from cargo_lambda_cdk import RustFunction
from os import path


class FunctionExampleCdkStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        function = RustFunction(
            self,
            "Rust Function",
            manifest_path=path.join("..", "..", "rust-function"),
        )

        CfnOutput(self, "Function ARN", value=function.function_arn)
