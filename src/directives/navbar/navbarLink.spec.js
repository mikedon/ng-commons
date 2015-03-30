describe("directive: navbarLink", function(){
	var element, scope, $compile, location;

	var hrefHtml = '<ngc-navbar-link href="#/login" label="Register"></ngc-navbar-link>';
	var actionHtml = '<ngc-navbar-link click="click()" label="Register"></ngc-navbar-link>';

    beforeEach(module('ng-commons'));
    beforeEach(inject(function(_$compile_, $rootScope, $location) {
    	scope = $rootScope;
		$compile = _$compile_;
		location = $location;
	}));

	function compileDirective(html){
		var elm = angular.element(html);
		elm = $compile(elm)(scope);
		scope.$digest();
		return elm;
	}

	it("is action when click attribute not null", function(){
		element = compileDirective(actionHtml);	
		expect(element.isolateScope().isAction).toBe(true);
	});

	it("is not action when click attribute is null", function() {
		element = compileDirective(hrefHtml);	
		expect(element.isolateScope().isAction).toBe(false);
	});

	it("sets active flag based on current route to true", function(){
		element = compileDirective(hrefHtml);
		spyOn(location, "path").and.returnValue("/login");
		scope.$broadcast('$routeChangeSuccess');
		expect(element.isolateScope().active).toBe(true);
	});

	it("sets active flag based on current route to false", function(){
		element = compileDirective(hrefHtml);
		spyOn(location, "path").and.returnValue("/home");
		scope.$broadcast('$routeChangeSuccess');
		expect(element.isolateScope().active).toBe(false);
	});

	it("calls the click function for actions", function(){
		element = compileDirective(actionHtml);
		spyOn(element.isolateScope(), "$apply").and.callThrough();
		scope.$broadcast('$routeChangeSuccess');
		element.triggerHandler("click");		
		expect(element.isolateScope().$apply).toHaveBeenCalled();
	});
});
