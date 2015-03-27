/// <reference path="../_all.ts"/>
var ngCommonsResource;
(function (ngCommonsResource) {
    var ApiServiceConfig = (function () {
        function ApiServiceConfig() {
            this.id = "@id";
            this.unnatural = false;
        }
        return ApiServiceConfig;
    })();
    /*
     * http://www.objectpartners.com/2014/06/03/extending-angulars-resource-service-for-a-consistent-api/
     */
    var ApiService = (function () {
        function ApiService() {
        }
        ApiService.prototype.$get = function ($resource) {
            return {
                add: function (config) {
                    // If the add() function is called with a
                    // String, create the default configuration.
                    if (typeof config == "string") {
                        var configObj = {
                            resource: config,
                            url: '/api/' + config
                        };
                        config = configObj;
                    }
                    // If the url follows the expected pattern, we can set cool defaults
                    if (!config.unnatural) {
                        config.url += '/:id';
                    }
                    // If we supply a method configuration, use that instead of the default extra. 
                    //var methods = config.methods || this.extraMethods;
                    this[config.resource] = $resource(config.url, config.params, config.methods);
                }
            };
        };
        return ApiService;
    })();
    angular.module('ng-commons.resources', []).provider('api', ApiService);
    var DataService = (function () {
        function DataService() {
        }
        DataService.prototype.addAlerts = function (alerts) {
            if (!alerts || alerts.length === 0) {
                return;
            }
            if (!this.$rootScope.alerts) {
                this.$rootScope.alerts = [];
            }
            this.$rootScope.alerts = this.$rootScope.alerts.concat(alerts);
        };
        DataService.prototype.beforeCall = function () {
            this.$rootScope.loadingView = true;
        };
        DataService.prototype.afterCall = function () {
            this.$rootScope.loadingView = false;
        };
        DataService.prototype.wrapPromise = function (promise) {
            promise.then(function (data) {
                this.afterCall();
                this.addAlerts(data.alerts);
            }, function (data) {
                this.afterCall();
                this.addAlerts(data.alerts);
            });
            return promise;
        };
        DataService.prototype.$get = function ($rootScope, api) {
            return {
                query: function (resource, query) {
                    this.beforeCall();
                    var promise = this.api[resource].query(query).$promise;
                    return this.wrapPromise(promise);
                },
                get: function (resource, query) {
                    this.beforeCall();
                    var promise = this.api[resource].get(query).$promise;
                    return this.wrapPromise(promise);
                },
                save: function (resource, model) {
                    this.beforeCall();
                    var promise = this.api[resource].save(model).$promise;
                    return this.wrapPromise(promise);
                },
                update: function (resource, model) {
                    this.beforeCall();
                    var promise = this.api[resource].update(model).$promise;
                    return this.wrapPromise(promise);
                },
                remove: function (resource, model) {
                    this.beforeCall();
                    var promise = api[resource].remove(resource, model).$promise;
                    return this.wrapPromise(promise);
                }
            };
        };
        return DataService;
    })();
    angular.module('ng-commons.resources', []).provider('data', DataService);
})(ngCommonsResource || (ngCommonsResource = {}));
