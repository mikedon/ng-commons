angular.module('ng-commons', ['ui.bootstrap', 'ng-commons-tpls', 'ng-commons.input', 'ng-commons.navbar', 'ng-commons.navbarLink', 'ng-commons.loading']);

angular.module('ng-commons').factory('BaseResource', function($resource, $http, $rootScope){
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
});
