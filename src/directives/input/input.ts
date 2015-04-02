/// <reference path="../../_all.ts"/>

module ngCommonsInput {
    'use srtict';

     export interface InputScope extends ng.IScope,ng.IAttributes {
        label : string;
        requiredMsg: string;
        validationMsg: string;
        forAttr?: string;
        showLabel: boolean;
        showErrors?: boolean;
        isError?: boolean;
        isRequiredError?: boolean;
     }

    export class InputDirective implements ng.IDirective {
        public restrict:string = "A";
        public require:string = "^form";
        public replace:boolean = false;
        public transclude:boolean = true;
        public templateUrl:string = 'directives/input/input.tpl.html';
        //private $scope:InputScope;
        public scope = {
            label: "@", // Gets the string contents of the `label` attribute.
            requiredMsg: "@",
            validationMsg: "@"
        };

        link = ($scope: InputScope, element: JQuery, attrs: InputScope, formController: ng.INgModelController) => {
            var input:JQuery;
            if(this.isSelect(element)){
                input = element.find("select");
            }else if(this.isInput(element)){
                input = element.find("input");
            }else{
                throw "Input Directive: unable to determine input type";
            }

            input.addClass('form-control');
            // The <label> should have a `for` attribute that links it to the input.
            // Get the `id` attribute from the input element
            // and add it to the scope so our template can access it.
            var id:string = input.attr("id");

            $scope.showLabel = attrs.label !== undefined;
            // change to forAttr because jslint doesn't like it
            // something probably broke because of this
            $scope.forAttr = id;

            var inputName:string = input.attr("name");
        
            //should we show errors at all?
            var showErrorsExpression:string = [formController.$name, '$submitted'].join(".");
            $scope.$parent.$watch(showErrorsExpression, (showErrors) => {
                $scope.showErrors = showErrors;
            });

            //does this input have errors?
            var errorExpression:string = [formController.$name, inputName, "$invalid"].join(".");
            $scope.$parent.$watch(errorExpression, (isError) => {
                $scope.isError = isError;
            });

            //did the required validation fail?
            var requiredErrorExpression = [formController.$name, inputName, "$error", "required"].join(".");
            $scope.$parent.$watch(requiredErrorExpression, (isRequiredError) => {
                $scope.isRequiredError = isRequiredError;
            });
        }

        private isSelect(element:JQuery) : boolean {
            return element.find('select').length > 0;
        }

        private isInput(element:JQuery) : boolean{
            return element.find("input").length > 0;
        }

        public static factory(): ng.IDirectiveFactory {
            return () => new InputDirective();
        }
    }
}

angular.module('ng-commons.input', []).directive("ngcInput", ngCommonsInput.InputDirective.factory());
