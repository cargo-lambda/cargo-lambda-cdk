//go:build no_runtime_type_checking

// CDK Construct to build Rust functions with Cargo Lambda
package cargolambdacdk

// Building without runtime type checking enabled, so all the below just return nil

func (r *jsiiProxy_RustFunction) validateAddEnvironmentParameters(key *string, value *string, options *awslambda.EnvironmentOptions) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateAddEventSourceParameters(source awslambda.IEventSource) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateAddEventSourceMappingParameters(id *string, options *awslambda.EventSourceMappingOptions) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateAddPermissionParameters(id *string, permission *awslambda.Permission) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateAddToRolePolicyParameters(statement awsiam.PolicyStatement) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateApplyRemovalPolicyParameters(policy awscdk.RemovalPolicy) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateConfigureAsyncInvokeParameters(options *awslambda.EventInvokeConfigOptions) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateGetResourceArnAttributeParameters(arnAttr *string, arnComponents *awscdk.ArnComponents) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateGetResourceNameAttributeParameters(nameAttr *string) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateGrantInvokeParameters(grantee awsiam.IGrantable) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateMetricParameters(metricName *string, props *awscloudwatch.MetricOptions) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateMetricDurationParameters(props *awscloudwatch.MetricOptions) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateMetricErrorsParameters(props *awscloudwatch.MetricOptions) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateMetricInvocationsParameters(props *awscloudwatch.MetricOptions) error {
	return nil
}

func (r *jsiiProxy_RustFunction) validateMetricThrottlesParameters(props *awscloudwatch.MetricOptions) error {
	return nil
}

func validateRustFunction_ClassifyVersionPropertyParameters(propertyName *string, locked *bool) error {
	return nil
}

func validateRustFunction_FromFunctionArnParameters(scope constructs.Construct, id *string, functionArn *string) error {
	return nil
}

func validateRustFunction_FromFunctionAttributesParameters(scope constructs.Construct, id *string, attrs *awslambda.FunctionAttributes) error {
	return nil
}

func validateRustFunction_IsConstructParameters(x interface{}) error {
	return nil
}

func validateRustFunction_IsResourceParameters(construct constructs.IConstruct) error {
	return nil
}

func validateRustFunction_MetricAllParameters(metricName *string, props *awscloudwatch.MetricOptions) error {
	return nil
}

func validateRustFunction_MetricAllConcurrentExecutionsParameters(props *awscloudwatch.MetricOptions) error {
	return nil
}

func validateRustFunction_MetricAllDurationParameters(props *awscloudwatch.MetricOptions) error {
	return nil
}

func validateRustFunction_MetricAllErrorsParameters(props *awscloudwatch.MetricOptions) error {
	return nil
}

func validateRustFunction_MetricAllInvocationsParameters(props *awscloudwatch.MetricOptions) error {
	return nil
}

func validateRustFunction_MetricAllThrottlesParameters(props *awscloudwatch.MetricOptions) error {
	return nil
}

func validateRustFunction_MetricAllUnreservedConcurrentExecutionsParameters(props *awscloudwatch.MetricOptions) error {
	return nil
}

func validateNewRustFunctionParameters(scope constructs.Construct, packageName *string, props *RustFunctionProps) error {
	return nil
}

