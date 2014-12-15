angular.module('ng-commons.navbar',[])
.directive('ngcNavbar', function(){
   return {
       restrict: "E",
       replace: true,
       transclude: true,
       scope: {
            brand: "@",
            brandImg: "@"
       },
       link: function(scope, element, attrs){
           scope.$parent.$on('$routeChangeSuccess', function(){
                //collapses navbar when the route changes
                var isOpen = element[0].querySelectorAll("div.in").length === 0 ? false : true;
                if(isOpen){
					var headerButton = element[0].querySelectorAll("div.navbar-header > button");
					headerButton[0].click();
                }
           });
       },
       templateUrl: 'navbar/navbar.tpl.html'
   };
});
