/// <reference path="../../_all.ts"/>

/**
 * directive that controls the ajax loading display
 */

module ngCommonsLoading {
    'use strict';
    export interface LoadingScope extends ng.IScope, ng.IAttributes {
        image: string;
        modalInstance: ng.ui.bootstrap.IModalServiceInstance;
    } 

    export class LoadingDirective implements ng.IDirective {
        public scope = {
            image:"@"
        }
        
        constructor(private $modal: ng.ui.bootstrap.IModalService){

        }

        link = ($scope: LoadingScope, element: JQuery, attrs: LoadingScope) => {
            //this is a dummy controller because $modal needs it
            var ModalInstanceCtrl = function ($scope, $modalInstance) {
            };
            $scope.$watch('loadingView', (loadingView) => {
                if(loadingView === false && $scope.modalInstance){
                    $scope.modalInstance.close();
                }else if(loadingView === true){
                    $scope.modalInstance = this.$modal.open({
                        template: attrs.image,
                        controller: ModalInstanceCtrl,
                        windowClass: "loading",
                        backdrop: "static",
                        keyboard: true
                    });
                }
            });
        }

        public static factory(): ng.IDirectiveFactory {
            var directive = ($modal: ng.ui.bootstrap.IModalService) => new LoadingDirective($modal);
            directive.$inject = ['$modal'];
            return directive;
        }    
    }
}
angular.module('ng-commons.loading', []).directive("ngcLoading", ngCommonsLoading.LoadingDirective.factory());
