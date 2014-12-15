describe("directive: navbar", function(){
	var element, scope, $compile;

    beforeEach(module('ng-commons'));
    beforeEach(inject(function(_$compile_, $rootScope) {
    	scope = $rootScope;
		$compile = _$compile_;

		var navbarHtml = 
        	'<ngc-navbar brand="TestApp" brand-img="assets/img/icon.png">' +
			'<li>' +
            '	<button class="btn btn-default btn-primary">' +
            '		<span class="glyphicon glyphicon-plus">Test Button</span>' +
            '	</button>' +
            '</li>';

		element = angular.element(navbarHtml);
		element = $compile(element)(scope);
		scope.$digest();
	}));

	it("collapses when the route changes", function(){
		var header = element.find('div');
		header = angular.element(header[0]);
		header.after("<div class='in'></div>");
		scope.$broadcast('$routeChangeSuccess');
		//TODO button is clicked but not sure how to assert that it was
		//expect(element[0].querySelectorAll("div.in").length).toBe(0);
	});
});
