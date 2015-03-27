/// <reference path="../_all.ts"/>

module ngCommonsUser {

	export class User {
		id: number;
		username: string;
		firstName: string;
		password: string;
		roles: string[];
	}

	export interface IUser extends angular.resource.IResource<User> {
		
	}

	export interface IUserService {
		user: User;
		reset(): void;
		isInitialized(): boolean;
		isLoggedIn(): boolean;
		hasRole(role:string): boolean;
		initialize(): ng.IPromise<User>;
		login(redirect:string): void;
		logout(redirect:string): void;
	}

	class UserService implements ng.IServiceProvider {
		public $get($resource: angular.resource.IResourceService, 
			$http: angular.IHttpService, 
			$rootScope : ngCommons.NgCommonsRootScope,
			$location: ng.ILocationService, 
			$q: ng.IQService, 
			authenticationUrl:string, 
			apiUrl:string) : IUserService {
			return {
				user: new User(),
				initialized: false,
				loggedIn: false,
				reset() {
					this.user = new User();
				},
				isInitialized(): boolean {
					return this.initialized;
				},
				isLoggedIn(): boolean {
					return this.loggedIn;
				},
				hasRole(role:string): boolean {
					return this.user.roles.indexOf(role) > -1;
				},
				initialize(): ng.IPromise<User> {
					var d = $q.defer();
					var user = $resource(apiUrl + 'api/user/secure/currentUser');
					user.get({}, (value, responseHeaders) => {
						if(value.username){
							this.user.username = value.username;
							this.user.firstName = value.firstName;
							this.user.lastName = value.lastName;
							this.user.roles = value.roles;
							this.initialized = true;
							this.loggedIn = true;
						}else{
							this.loggedIn = false;
						}
						d.resolve();
					});
					return d.promise;
				},
				login(redirect:string) {
					// var that = this;
					var payload = 'j_username=' + this.user.username + '&j_password=' + this.user.password;
					var config = {
						headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
					};
					$http.post(authenticationUrl + 'j_spring_security_check', payload, config)
					.success(() => {
						this.user.password = '';
						this.loggedIn = true;
						$location.path(redirect);
						})
					.error(
						() => {
							this.reset();
						}
					);
				},
				logout(redirect:string) {
					this.reset();
					$http.get(authenticationUrl + 'j_spring_security_logout').success((data:any) => {
						$location.path(redirect);
					});
				}
			}
		}
	}
}