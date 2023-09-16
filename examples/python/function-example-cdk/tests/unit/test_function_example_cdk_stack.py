import aws_cdk as core
import aws_cdk.assertions as assertions

from function_example_cdk.function_example_cdk_stack import FunctionExampleCdkStack

# example tests. To run these tests, uncomment this file along with the example
# resource in function_example_cdk/function_example_cdk_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = FunctionExampleCdkStack(app, "function-example-cdk")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
