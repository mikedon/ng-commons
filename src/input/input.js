angular.module('ng-commons', [])
.directive("bsInput", function(){
	return {
		restrict: "A",
        require: "^form",
        replace: false,
        transclude: true,
        scope: {
            label: "@", // Gets the string contents of the `label` attribute.
            requiredMsg: "@",
            validationMsg: "@"
        },
        link: function(scope, element, attrs, formController) {
            var input = element.find("input") ? element.find("input") : element.find("select");
            input.addClass('form-control');
            // The <label> should have a `for` attribute that links it to the input.
            // Get the `id` attribute from the input element
            // and add it to the scope so our template can access it.
            var id = input.attr("id");

            scope.showLabel = attrs.label !== undefined;
			// change to forAttr because jslint doesn't like it
			// something probably broke because of this
            scope.forAttr = id;

            // Get the `name` attribute of the input
            var inputName = input.attr("name");
            // Build the scope expression that contains the validation status.
            // e.g. "form.example.$invalid"
            var errorExpression = [formController.$name, inputName, "$invalid"].join(".");
            // Watch the parent scope, because current scope is isolated.

            //should we show errors at all?
            var showErrorsExpression = [formController.$name, 'submitted'].join(".");
            scope.$parent.$watch(showErrorsExpression, function(showErrors){
                scope.showErrors = showErrors;
            });

            //does this input have errors?
            scope.$parent.$watch(errorExpression, function(isError) {
                scope.isError = isError;
            });

            //did the required validation fail?
            var requiredErrorExpression = [formController.$name, inputName, "$error", "required"].join(".");
            scope.$parent.$watch(requiredErrorExpression, function(isRequiredError) {
                scope.isRequiredError = isRequiredError;
            });

            //TODO did the other types of validations fail?
        },
        templateUrl: 'input/input.tpl.html'
	};
});
