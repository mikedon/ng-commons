module ngCommonsNavbar {
    'use strict';

    export interface NavbarScope extends ng.IScope, ng.IAttributes {
        brand: string;
        brandImg: string;
        state: string;
    }

    export interface NavbarLinkScope extends ng.IScope {
        linkClass: string;
        label: string;
        href: string;
        show: string;
        click: string;
        isAction: boolean;
        active: boolean;
    }

    export class NavbarDirective implements ng.IDirective {
        public restrict:string = "E";
        public replace:boolean = true;
        public transclude:boolean = true;
        public templateUrl:string = 'directives/navbar/navbar.tpl.html';
        public scope = {
            brand: "@",
            brandImg: "@",
            state: "@"
        }

        link = ($scope: NavbarScope, element: JQuery, attrs: NavbarScope) => {
            $scope.$parent.$on('$routeChangeSuccess', function() {
                    //collapses navbar when the route changes
                    var isOpen: boolean = element[0].querySelectorAll("div.in").length === 0 ? false : true;
                    if(isOpen){
                        var headerButton : NodeList = element[0].querySelectorAll("div.navbar-header > button");
                        //TODO error TS2339: Property 'click' does not exist on type 'Node'
                        //headerButton[0].click();
                    }
                });
        }

        public static factory(): ng.IDirectiveFactory {
            return () => new NavbarDirective;
        }
    }

    export class NavbarLinkDirective implements ng.IDirective {
        public restrict:string = "E";
        public replace:boolean = true;
        public templateUrl:string = 'directives/navbar/navbarLink.tpl.html'
        public scope = {
            linkClass : "@",
            label : "@",
            href : "@",
            show: "&",
            click: "&"
        }

        constructor(private $location: ng.ILocationService){}

        link = ($scope: NavbarLinkScope, element: JQuery, attrs: NavbarLinkScope) => {
            $scope.isAction = attrs.click != null;
            $scope.$parent.$on('$routeChangeSuccess', () => {
                if($scope.href) {
                    var href = $scope.href.substring(1);
                    $scope.active = this.$location.path() === href;
                }
                if($scope.click) {
                    element.bind("click", () => {
                        $scope.$apply(attrs.click);
                    });
                }
            });
        }

        public static factory(): ng.IDirectiveFactory {
            var directive:ng.IDirectiveFactory = ($location: ng.ILocationService) => new NavbarLinkDirective($location);
            directive.$inject =['$location'];
            return directive;
        }
    }
}

angular.module('ng-commons.navbar',[]).directive("ngcNavbar", ngCommonsNavbar.NavbarDirective.factory()).directive("ngcNavbarLink", ngCommonsNavbar.NavbarLinkDirective.factory());

