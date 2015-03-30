/// <reference path="../../_all.ts"/>

/**
 * directive that controls the ajax loading display
 */

module ngCommonsLoading {
    'use strict';
    export interface LoadingScope extends ng.IScope {
        image: string;
        modalInstance: ng.ui.bootstrap.IModalServiceInstance;
    } 
    export function loading($modal: ng.ui.bootstrap.IModalService) : ng.IDirective {
        return {
             scope: {
                image: "@"
            },
            link: function(scope: LoadingScope, element: JQuery, attrs: any){
                //this is a dummy controller because $modal needs it
                var ModalInstanceCtrl = function ($scope, $modalInstance) {
                };
                scope.$watch('loadingView', function(loadingView){
                    if(loadingView === false && scope.modalInstance){
                        scope.modalInstance.close();
                    }else if(loadingView === true){
                        scope.modalInstance = $modal.open({
                            template: attrs.image,
                            controller: ModalInstanceCtrl,
                            windowClass: "loading",
                            backdrop: "static",
                            keyboard: true
                        });
                    }
                });
            }
        }
    }
    loading.$inject = ['$modal'];
}
angular.module('ng-commons.loading', []).directive("ngcLoading", ngCommonsLoading.loading);
