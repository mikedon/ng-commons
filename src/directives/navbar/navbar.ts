/// <reference path="../../_all.ts"/>

module ngCommonsNavbar {
    'use strict';

    export interface NavbarScope extends ng.IScope {
        brand: string;
        brandImg: string;
    }

    export function navbar() : ng.IDirective {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            scope: {
                brand: "@",
                brandImg: "@"
                },
            link: function(scope: NavbarScope, element: JQuery, attrs : any){
                scope.$parent.$on('$routeChangeSuccess', function(){
                    //collapses navbar when the route changes
                    var isOpen: boolean = element[0].querySelectorAll("div.in").length === 0 ? false : true;
                    if(isOpen){
                        var headerButton : NodeList = element[0].querySelectorAll("div.navbar-header > button");
                        //TODO error TS2339: Property 'click' does not exist on type 'Node'
                        //headerButton[0].click();
                    }
                });
            },
            templateUrl: 'directives/navbar/navbar.tpl.html'
        }
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

    export function navbarLink($location: ng.ILocationService) : ng.IDirective {
        return {
            restrict: "E",
            replace: true,
            scope: {
                linkClass: "@",
                label: "@",
                href: "@",
                show: "&",
                click: "&"
            },
            link: function(scope: NavbarLinkScope, element: JQuery, attrs: any){
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
            templateUrl: 'directives/navbar/navbarLink.tpl.html'
        };
    }

    navbarLink.$inject = ['$location'];    
}

angular.module('ng-commons.navbar',[]).directive("ngcNavbar", ngCommonsNavbar.navbar).directive("ngcNavbarLink", ngCommonsNavbar.navbarLink);

