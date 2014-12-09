angular.module('navbar',[])
.directive('navbar', function(){
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
                var isOpen = element.find('div.in').length === 0 ? false : true;
                if(isOpen){
                    element.find('div.navbar-header > button').click();
                }
           });
       },
       templateUrl: 'navbar/navbar.tpl.html'
   };
});
