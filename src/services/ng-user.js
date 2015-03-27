/// <reference path="../_all.ts"/>
var ngCommonsUser;
(function (ngCommonsUser) {
    var User = (function () {
        function User() {
        }
        return User;
    })();
    ngCommonsUser.User = User;
    var UserService = (function () {
        function UserService() {
        }
        UserService.prototype.$get = function ($resource, $http, $rootScope, $location, $q, authenticationUrl, apiUrl) {
            return {
                user: new User(),
                initialized: false,
                loggedIn: false,
                reset: function () {
                    this.user = new User();
                },
                isInitialized: function () {
                    return this.initialized;
                },
                isLoggedIn: function () {
                    return this.loggedIn;
                },
                hasRole: function (role) {
                    return this.user.roles.indexOf(role) > -1;
                },
                initialize: function () {
                    var _this = this;
                    var d = $q.defer();
                    var user = $resource(apiUrl + 'api/user/secure/currentUser');
                    user.get({}, function (value, responseHeaders) {
                        if (value.username) {
                            _this.user.username = value.username;
                            _this.user.firstName = value.firstName;
                            _this.user.lastName = value.lastName;
                            _this.user.roles = value.roles;
                            _this.initialized = true;
                            _this.loggedIn = true;
                        }
                        else {
                            _this.loggedIn = false;
                        }
                        d.resolve();
                    });
                    return d.promise;
                },
                login: function (redirect) {
                    var _this = this;
                    // var that = this;
                    var payload = 'j_username=' + this.user.username + '&j_password=' + this.user.password;
                    var config = {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    };
                    $http.post(authenticationUrl + 'j_spring_security_check', payload, config).success(function () {
                        _this.user.password = '';
                        _this.loggedIn = true;
                        $location.path(redirect);
                    }).error(function () {
                        _this.reset();
                    });
                },
                logout: function (redirect) {
                    this.reset();
                    $http.get(authenticationUrl + 'j_spring_security_logout').success(function (data) {
                        $location.path(redirect);
                    });
                }
            };
        };
        return UserService;
    })();
})(ngCommonsUser || (ngCommonsUser = {}));
