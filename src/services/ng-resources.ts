/// <reference path="../_all.ts"/>

module ngCommonsResource {

	class ApiServiceConfig {
		params:any;
		url:string;
		id:string = "@id";
		unnatural:boolean = false;
	}

	interface IApiService  {
		add(config: ApiServiceConfig) : void;
		add(config: string) : void
		add(config) : void;
	}

	/*
	 * http://www.objectpartners.com/2014/06/03/extending-angulars-resource-service-for-a-consistent-api/
	 */
	class ApiService  implements ng.IServiceProvider {
		public $get($resource: angular.resource.IResourceService) : IApiService {
			return {
				add(config) {
					// If the add() function is called with a
        			// String, create the default configuration.
					if(typeof config == "string"){
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
			}
		}
	}
	angular.module('ng-commons.resources',[]).provider('api', ApiService);

	interface IDataService {
		query(resource: string, query: any): ng.IPromise<any>;
		get(resource: string, query: any): ng.IPromise<any>;
		save(resource: string, model: any): ng.IPromise<any>;
		update(resource: string, model: any): ng.IPromise<any>;
		remove(resource: string, model: any): ng.IPromise<any>;
	}

	class DataService implements ng.IServiceProvider {

		private $rootScope: ngCommons.NgCommonsRootScope;
		private api: IApiService

		private addAlerts(alerts:any) : void { 
			if(!alerts || alerts.length === 0){
            	return;
        	}
        	if(!this.$rootScope.alerts){
            	this.$rootScope.alerts = [];
        	}
        	this.$rootScope.alerts = this.$rootScope.alerts.concat(alerts);
		}
        		
		private beforeCall() {
			this.$rootScope.loadingView = true;
		}

		private afterCall() {
			this.$rootScope.loadingView = false;
		}
		private wrapPromise(promise: ng.IPromise<any>) : ng.IPromise<any> {
			promise.then(function(data){
					this.afterCall();
					this.addAlerts(data.alerts);
				}, function(data){
					this.afterCall();
					this.addAlerts(data.alerts);
				});
				return promise;
		}
		
		public $get($rootScope: ng.IRootScopeService, api : IApiService) : IDataService {

			return {
				query(resource: string, query: any) : ng.IPromise<any> {
					this.beforeCall();
					var promise = this.api[resource].query(query).$promise;  
					return this.wrapPromise(promise);
				},

				get(resource: string, query: any) : ng.IPromise<any> {
					this.beforeCall();
					var promise = this.api[resource].get(query).$promise;
					return this.wrapPromise(promise);
				},
				save(resource: string, model: any) :ng.IPromise<any>{
					this.beforeCall();
					var promise = this.api[resource].save(model).$promise;
					return this.wrapPromise(promise);
				},
				update(resource: string, model: any) : ng.IPromise<any>{
					this.beforeCall();
					var promise = this.api[resource].update(model).$promise;
					return this.wrapPromise(promise);
				},
				remove(resource: string, model: any) : ng.IPromise<any>{
					this.beforeCall();
					var promise = api[resource].remove(resource, model).$promise;
					return this.wrapPromise(promise);
				}
			}
		}
	}
    angular.module('ng-commons.resources',[]).provider('data', DataService);
}