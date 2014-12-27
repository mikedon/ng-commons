angular.module('ng-commons', [
		'ui.bootstrap', 
		'ng-commons.resources', 
		'ng-commons.User', 
		'ng-commons-tpls', 
		'ng-commons.input', 
		'ng-commons.navbar', 
		'ng-commons.navbarLink', 
		'ng-commons.loading'
]);

/*
 * http://www.objectpartners.com/2014/06/03/extending-angulars-resource-service-for-a-consistent-api/
 */
angular.module('ng-commons.resources', [])
.provider('api', function(){
	return {
		$get: ['$resource', function($resource){
			var api = {
      			defaultConfig : {id: '@id'},
      			add : function (config) {
        			var params, url;
        			// If the add() function is called with a
        			// String, create the default configuration.
        			if (angular.isString(config)) {
          				var configObj = {
            				resource: config,
            				url: '/api/' + config
          				};
          				config = configObj;
        			}
        			// If the url follows the expected pattern, we can set cool defaults
        			if (!config.unnatural) {
          				var orig = angular.copy(api.defaultConfig);
          				params = angular.extend(orig, config.params);
          				url = config.url + '/:id';
        			// otherwise we have to declare the entire configuration. 
        			} else {
          				params = config.params;
          				url = config.url;
        			}
        			// If we supply a method configuration, use that instead of the default extra. 
        			var methods = config.methods || api.extraMethods;
        			api[config.resource] = $resource(url, params, methods);
      			}
    		};    
    		return api;
		}]
	};
})
.provider('data', function(){
	return {
    	$get: ['$rootScope', 'api', function ($rootScope, api) {
    		var addAlerts = function(alerts){
        		if(!alerts || alerts.length === 0){
            		return;
        		}
        		if(!$rootScope.alerts){
            		$rootScope.alerts = [];
        		}
        		$rootScope.alerts = $rootScope.alerts.concat(alerts);
    		};
			var beforeCall = function(){
				$rootScope.loadingView = true;
			};
			var afterCall = function(){
				$rootScope.loadingView = false;
			};
			var wrapPromise = function(promise) {
				promise.then(function(data){
					afterCall();
					addAlerts(data.alerts);
				}, function(data){
					afterCall();
					addAlerts(data.alerts);
				});
				return promise;
			};
      		var data = {
        		query: function (resource, query) {
					beforeCall();
          			var promise = api[resource].query(query).$promise;  
					return wrapPromise(promise);
        		},
        		get : function (resource, query) {
					beforeCall();
            		var promise = api[resource].get(query).$promise;
					return wrapPromise(promise);
        		},
        		save : function (resource, model) {
					beforeCall();
          			var promise = api[resource].save(model).$promise;
					return wrapPromise(promise);
        		}, 
        		update : function (resource, model) {
					beforeCall();
          			var promise = api[resource].update(model).$promise;
					return wrapPromise(promise);
        		},
        		remove : function (resource, model) {
					beforeCall();
          			var promise = api[resource].remove(resource, model).$promise;
					return wrapPromise(promise);
        		}
      		};
      		return data;
    	}]
	};
});

angular.module('ng-commons.User', [])
.provider('User', function(){
	return {
		$get : ['$resource', '$http', '$location', '$rootScope', '$q', 'authenticationUrl', 'apiUrl', function($resource, $http, $location, $rootScope, $q, authenticationUrl, apiUrl){
			return {
				initialized : false,
				loggedIn : false,
				username: '',
				firstName: '',
				lastName: '',
				password: '',
				roles: [],
				reset : function(){
					this.initialized = false;
					this.loggedIn = false;
					this.username = '';
					this.firstName = '';
					this.lastName = '';
					this.password = '';
					this.roles = [];
				},
				isInitialized : function(){
					return this.initialized;
				},
				isLoggedIn : function(){
					return this.loggedIn;
				},
				hasRole: function(role){
					return this.roles.indexOf(role) > -1;
				},
				initialize : function(){
					/**
					 * intialize the User object with currently logged in user.
					 *
					 * we call this more than we should
					 */
					var d = $q.defer();
					var that = this;
					var user = $resource(apiUrl + 'api/user/secure/currentUser');
					user.get({}, function(value, responseHeaders){
						if(value.username){
							that.username = value.username;
							that.firstName = value.firstName;
							that.lastName = value.lastName;
							that.roles = value.roles;
							that.initialized = true;
							that.loggedIn = true;
						}else{
							that.loggedIn = false;
						}
						d.resolve(that);
					});
					return d.promise;
				},
				login : function(redirect){
					var that = this;
					var payload = 'j_username=' + this.username + '&j_password=' + this.password;
					var config = {
						headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
					};
					$http.post(authenticationUrl + 'j_spring_security_check', payload, config,
						function(){
							that.password = '';
							that.loggedIn = true;
							$location.path(redirect);
						},
						function(){
							that.reset();
						}
					);
				},
				logout : function(redirect){
					this.reset();
					$http.get(authenticationUrl + 'j_spring_security_logout').success(function(data){
						$location.path(redirect);
					});
				}
			};
		}]
	};
});
