module ngCommonsUser {

	export class User {
		id: number;
		username: string;
		firstName: string;
        lastName: string;
		password: string;
		roles: string[] = [];
	}

	export interface IUser extends angular.resource.IResource<User> {

	}

	export interface IUserService {
		user: User;
		reset(): void;
        initialized: boolean;
        loggedIn: boolean;
		isInitialized(): boolean;
		isLoggedIn(): boolean;
		hasRole(role:string): boolean;
		initialize(): ng.IPromise<User>;
		login(redirect:string): void;
		logout(redirect:string): void;
	}

	export class UserService {        
		private user: User;
        private initialized: Boolean;
        private loggedIn: Boolean;
        private $resource: angular.resource.IResourceService;
        private $http: angular.IHttpService;
        private $rootScope: ngCommons.NgCommonsRootScope;
        private $state: ng.ui.IStateService;
        private $q: ng.IQService;
        private authenticationUrl: string;
        private apiUrl: string;
        constructor(){
            
        }   
                                            
        reset(){
            this.user = new User();
        }
        
        isInitialized(): Boolean{
            return this.initialized;
        }
        
        isLoggedIn(): Boolean{
            return this.loggedIn;
        }
        
        hasRole(role: string): Boolean {
            return this.user.roles.indexOf(role) > -1;
        }
        
        public intialize(): ng.IPromise<User> {
            var d = this.$q.defer();
            var user = this.$resource(this.apiUrl + 'api/user/secure/currentUser');
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
        }
        
        login(state:string) {
            // var that = this;
            var payload = 'j_username=' + this.user.username + '&j_password=' + this.user.password;
            var config = {};
            config['headers']["Content-Type"] = 'application/x-www-form-urlencoded; charset=UTF-8';
            this.$http.post(this.authenticationUrl + 'j_spring_security_check', payload, config)
            .success(() => {
                this.user.password = '';
                this.loggedIn = true;
                this.$state.go(state);
            })
            .error(() => {
                this.reset();
            });
        }
        
        logout(state:string) {
            this.reset();
            this.$http.get(this.authenticationUrl + 'j_spring_security_logout').success((data:any) => {
                this.$state.go(state);
            });
        }
        
        $get  = ['$resource', '$http', '$rootScope', '$state', '$q', 'authenticationUrl', 'apiUrl', 
            ($resource: angular.resource.IResourceService, $http: angular.IHttpService, $rootScope : ngCommons.NgCommonsRootScope, $state: ng.ui.IStateService, $q: ng.IQService, authenticationUrl:string, apiUrl:string) => {
            this.$resource = $resource;
            this.$http = $http;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$q = $q;
            this.authenticationUrl = authenticationUrl;
            this.apiUrl = apiUrl;
            return this;                 
        }];        
	}
}
angular.module('ng-commons.User', ['ngResource']).provider('User', ngCommonsUser.UserService);