module.exports = function(grunt){

    require('load-grunt-config')(grunt, {
        data: {
            app_files: {
                js: ['src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js'],
                jsunit: [ 'src/**/*.spec.js' ],
                tpls: 'src/**/*.tpl.html'
            },
            test_files: {
                js: [
                'node_modules/angular/angular.js',
                'node_modules/angular-resource/angular-resource.js',
                'node_modules/angular-ui-router/release/angular-ui-router.js',
                'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
                'node_modules/angular-mocks/angular-mocks.js'
                ]
            },
        }
    });
};
