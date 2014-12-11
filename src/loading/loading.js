/**
 * directive that controls the ajax loading display
 */
angular.module('ng-commons.loading', [])

.directive("ngcLoading", ["$modal",
    function($modal){
        return {
            scope: {
                image: "@"
            },
            link: function(scope, element, attrs){
                var modalInstance;
                //this is a dummy controller because $modal needs it
                var ModalInstanceCtrl = function ($scope, $modalInstance) {
                };
                scope.$watch('loadingView', function(loadingView){
                    if(loadingView === false && modalInstance){
                        modalInstance.close();
                    }else if(loadingView === true){
                        modalInstance = $modal.open({
                            template: attrs.image,
                            controller: ModalInstanceCtrl,
                            windowClass: "loading",
                            backdrop: "static",
                            keyboard: true
                        });
                    }
                });
            }
        };
    }
]);
