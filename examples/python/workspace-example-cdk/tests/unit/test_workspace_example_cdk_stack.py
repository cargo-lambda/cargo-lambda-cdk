import aws_cdk as core
import aws_cdk.assertions as assertions

from workspace_example_cdk.workspace_example_cdk_stack import WorkspaceExampleCdkStack

# example tests. To run these tests, uncomment this file along with the example
# resource in workspace_example_cdk/workspace_example_cdk_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = WorkspaceExampleCdkStack(app, "workspace-example-cdk")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
