

describe("directive: input",  function() {
    var element, scope, isolateScope, $compile;

    beforeEach(module('ng-commons'));
    beforeEach(module('input/input.tpl.html'));
    beforeEach(inject(function(_$compile_, $rootScope) {
    	scope = $rootScope;
		$compile = _$compile_;
	}));

	var textInputHtml =
		'<form name="testForm"><div ngc-input label="Test Label" required-msg="Value is required"> ' +
		'   <input type="text"' +
		'       name="testName"' +
		'       id="testId"' +
		'       ng-model="testValue"'+
		'       required>'+
		'</div></form>';

	var noFormHtml = 
		'<div ngc-input label="Test Label" required-msg="Value is required"> ' +
		'   <input type="text"' +
		'       name="testName"' +
		'       id="testId"' +
		'       ng-model="testValue"'+
		'       required>'+
		'</div>';

	function compileDirective(html){
		var elm = angular.element(html);
		elm = $compile(elm)(scope);
		scope.$digest();
		return elm;
	}

    it("should add the form-control style class", function(){
		element = compileDirective(textInputHtml);
        expect(element.find('input').hasClass('form-control')).toBe(true);
    });
	it("should display the required message", function(){
		element = compileDirective(textInputHtml);
		//simulate form submission
		scope.testForm.submitted = true;
		scope.testForm.testName.$invalid = true;
		scope.testForm.testName.$error.required = true;
		scope.$apply();

		//You have to grab the isolateScope off the element with the ng isolate scope class.  Makes sense, was a pain to figure out.
		var isolateScopeElement = angular.element(element[0].children[0]);
		isolateScope = isolateScopeElement.isolateScope();

		var requiredErrorMsgDiv = angular.element(element.find('label').next().children()[0]);
		expect(requiredErrorMsgDiv.text()).toBe('Value is required');
		expect(isolateScope.showErrors).toBe(true);
		expect(isolateScope.isError).toBe(true);
		expect(isolateScope.isRequiredError).toBe(true);
	});
	it("should require a form", function() {
		var exception = false;
		try{
			element = compileDirective(noFormHtml, true);
		}catch(e){
			exception = true;
		}finally{	
			expect(exception).toBe(true);
		}	
	});
});
