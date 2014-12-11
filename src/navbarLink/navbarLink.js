angular.module('ng-commons.navbarLink',[])
.directive('ngcNavbarLink', ["$location",
    function($location){
        return {
            restrict: "E",
            replace: true,
            scope: {
                label: "@",
                href: "@",
                show: "&",
                click: "&"
            },
            link: function(scope, element, attrs){
                scope.isAction = attrs.click != null;
                scope.$parent.$on('$routeChangeSuccess', function(){
                    if(scope.href) {
                        var href = scope.href.substring(1);
                        scope.active = $location.path() === href;
                    }
                    if(scope.click) {
                        element.bind("click", function(){
                            scope.$apply(attrs.click);
                        });
                    }
                });
            },
            templateUrl: 'navbarLink/navbarLink.tpl.html'
        };
    }
]);
