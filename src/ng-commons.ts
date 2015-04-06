/// <reference path="_all.ts"/>

module ngCommons {
	'use strict';
	var ngCommons = angular.module('ng-commons', [
		'ui.router',
		'ui.bootstrap', 
		'ng-commons.resources', 
		'ng-commons.User', 
		'ng-commons-tpls', 
		'ng-commons.input', 
		'ng-commons.navbar', 
		'ng-commons.loading'
	]);

	export enum AlertType {info, warning, danger, success}
	export class Alert {
		type:string;
		message:string;
	}

	export interface NgCommonsRootScope extends ng.IRootScopeService{
		alerts:Alert[];
		loadingView:boolean;
		clearAlerts: boolean;
		captureRedirect: ng.ui.IState;
	}
}
