describe("directive: input",  function() {
    var element, scope;

    beforeEach(module('ng-commons'));
    beforeEach(module('input/input.tpl.html'));

    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();

        element =
            '<form name="testForm"><div bs-input label="Test Label" required-msg="Value is required"> ' +
            '   <input type="text"' +
            '       name="testName"' +
            '       id="testId"' +
            '       ng-model="testValue"'+
            '       required>'+
            '</div></form>';

        //scope.testValue = "this is my test value";

        element = $compile(element)(scope);
        scope.$digest();
    }));

    describe('with required input', function(){
        it("should add the form-control style class", function(){
            expect(element.find('input').hasClass('form-control'));
        });
    });
});
