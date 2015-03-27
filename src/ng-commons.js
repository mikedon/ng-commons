/// <reference path="_all.ts"/>
var ngCommons;
(function (_ngCommons) {
    'use strict';
    var ngCommons = angular.module('ng-commons', [
        'ui.bootstrap',
        'ng-commons.resources',
        'ng-commons.User',
        'ng-commons-tpls',
        'ng-commons.input',
        'ng-commons.navbar',
        'ng-commons.navbarLink',
        'ng-commons.loading'
    ]);
    (function (AlertType) {
        AlertType[AlertType["INFO"] = 0] = "INFO";
        AlertType[AlertType["WARNING"] = 1] = "WARNING";
        AlertType[AlertType["ERROR"] = 2] = "ERROR";
        AlertType[AlertType["SUCCESS"] = 3] = "SUCCESS";
    })(_ngCommons.AlertType || (_ngCommons.AlertType = {}));
    var AlertType = _ngCommons.AlertType;
    var Alert = (function () {
        function Alert() {
        }
        return Alert;
    })();
    _ngCommons.Alert = Alert;
})(ngCommons || (ngCommons = {}));
