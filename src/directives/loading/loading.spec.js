describe("directive: loading", function(){
	var element, scope, $compile, modal;

    beforeEach(module('ng-commons'));
    beforeEach(inject(function(_$compile_, $rootScope, $modal) {
    	scope = $rootScope;
		$compile = _$compile_;
		modal = $modal;
		spyOn(modal, 'open').and.callThrough();

		var loadingHtml = '<div ngc-loading image="assets/img/ajax-loader.gif"></div>';
		element = angular.element(loadingHtml);
		element = $compile(element)(scope);
		scope.$digest();
	}));

	it("should open when loadingView is true", function(){
		element.isolateScope().loadingView = true;	
		scope.$apply();
		expect(modal.open).toHaveBeenCalled();	
	});

	it("should close when loadingView is false", function(){
		element.isolateScope().loadingView = true;	
		scope.$apply();
		spyOn(element.isolateScope().modalInstance, 'close');
		element.isolateScope().loadingView = false;
		scope.$apply();
		expect(element.isolateScope().modalInstance.close).toHaveBeenCalled();
	});
});