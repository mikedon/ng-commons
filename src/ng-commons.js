angular.module('ng-commons', ['ui.bootstrap', 'ng-commons.BaseResource', 'ng-commons.User', 'ng-commons-tpls', 'ng-commons.input', 'ng-commons.navbar', 'ng-commons.navbarLink', 'ng-commons.loading']);

angular.module('ng-commons.BaseResource',[]).provider('BaseResource', function(){
	return {
		$get: ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope){
    		var addAlerts = function(alerts){
        		if(!alerts || alerts.length === 0){
            		return;
        		}
        		if(!$rootScope.alerts){
            		$rootScope.alerts = [];
        		}
        		$rootScope.alerts = $rootScope.alerts.concat(alerts);
    		};
			var hasErrors = function(){
				if($rootScope.alerts){
					for(var i=0; i < $rootScope.alerts.length; i++){
						if($rootScope.alerts[i].type === 'danger'){
							return true;
						}
					}
				}
				return false;
			};
			var handleResponse = function(data, onSuccess, onFailure){
				afterCall();
				addAlerts(data.alerts);
				if(hasErrors()){
					if(onFailure){
						onFailure();
					}
				}else{
					if(onSuccess){
						onSuccess(data);
					}
				}
			};
			var beforeCall = function(){
				$rootScope.loadingView = true;
			};
			var afterCall = function(){
				$rootScope.loadingView = false;
			};
			return {
				save: function(resource, onSuccess, onFailure){
					beforeCall();
					return resource.$save(function(data){
						handleResponse(data, onSuccess, onFailure);
					});
				},
				get: function(resource, onSuccess, onFailure){
					beforeCall();
					return resource.get(function(data){
						handleResponse(data, onSuccess, onFailure);
					});
				},
				query: function(resource, onSuccess, onFailure){
					beforeCall();
					return resource.query(function(data){
						handleResponse(data, onSuccess, onFailure);
					});
				},
				post: function(url, payload, config, onSuccess, onFailure){
					beforeCall();
					return  $http.post(url, payload, config)
						.success(function(data) {
							handleResponse(data, onSuccess, onFailure);
						});
				},
				clearAlerts: function(){
					$rootScope.alerts = [];
				}
			};
		}]
	};
});

angular.module('ng-commons.User', []).provider('User', function(){
	return {
		$get : ['$resource', 'BaseResource', '$http', '$location', '$rootScope', '$q', 'authenticationUrl', 'apiUrl', function($resource, BaseResource, $http, $location, $rootScope, $q, authenticationUrl, apiUrl){
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
					VoodieResource.clearAlerts();
					var that = this;
					var payload = 'j_username=' + this.username + '&j_password=' + this.password;
					var config = {
						headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
					};
					VoodieResource.post(authenticationUrl + 'j_spring_security_check', payload, config,
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
