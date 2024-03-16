//go:build no_runtime_type_checking

package cargolambdacdk

// Building without runtime type checking enabled, so all the below just return nil

func (r *jsiiProxy_RustExtension) validateAddPermissionParameters(id *string, permission *awslambda.LayerVersionPermission) error {
	return nil
}

func (r *jsiiProxy_RustExtension) validateApplyRemovalPolicyParameters(policy awscdk.RemovalPolicy) error {
	return nil
}

func (r *jsiiProxy_RustExtension) validateGetResourceArnAttributeParameters(arnAttr *string, arnComponents *awscdk.ArnComponents) error {
	return nil
}

func (r *jsiiProxy_RustExtension) validateGetResourceNameAttributeParameters(nameAttr *string) error {
	return nil
}

func validateRustExtension_FromLayerVersionArnParameters(scope constructs.Construct, id *string, layerVersionArn *string) error {
	return nil
}

func validateRustExtension_FromLayerVersionAttributesParameters(scope constructs.Construct, id *string, attrs *awslambda.LayerVersionAttributes) error {
	return nil
}

func validateRustExtension_IsConstructParameters(x interface{}) error {
	return nil
}

func validateRustExtension_IsOwnedResourceParameters(construct constructs.IConstruct) error {
	return nil
}

func validateRustExtension_IsResourceParameters(construct constructs.IConstruct) error {
	return nil
}

func validateNewRustExtensionParameters(scope constructs.Construct, resourceName *string, props *RustExtensionProps) error {
	return nil
}

