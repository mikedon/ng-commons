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
        };
    }
]);
