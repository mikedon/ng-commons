module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-html2js');
  	grunt.loadNpmTasks('grunt-karma');

	var taskConfig = {
		build_dir: 'build',
		app_files: {
    		js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    		jsunit: [ 'src/**/*.spec.js' ],
    		tpl: [ 'src/**/*.tpl.html' ]
  		},
		test_files: {
    		js: [
				'bower_components/angular/angular.js',
      			'bower_components/angular-mocks/angular-mocks.js'
    		]
  		},
		clean: [ 
      		'<%= build_dir %>', 
    	],
		jshint: {
      		src: [ 
        		'<%= app_files.js %>'
      		],
      		test: [
        		'<%= app_files.jsunit %>'
      		],
      		gruntfile: [
        		'Gruntfile.js'
      		],
      		options: {
        		curly: true,
        		immed: true,
        		newcap: true,
        		noarg: true,
        		sub: true,
        		boss: true,
        		eqnull: true
      		},
      		globals: {}
    	},
 		html2js: {
        	options: {
          		base: 'src',
				module: 'ng-commons-tpls'
        	},
			tpls : {
        		src: [ '<%= app_files.tpl %>' ],
        		dest: 'ng-commons-tpls.js'
			}
      	},
		copy: {
			build_js: {
        		files: [
          			{
            			src: [ '<%= app_files.js %>' ],
            			dest: '<%= build_dir %>/',
            			cwd: '.',
            			expand: true
          			}
        		]
      		}	
		},
    	karma: {
      		options: {
        		configFile: '<%= build_dir %>/karma-unit.js'
      		},
      		unit: {
        		port: 9019,
        		background: true
      		},
      		continuous: {
        		singleRun: true
      		}
    	},	
		karmaconfig: {
      		unit: {
        		dir: '<%= build_dir %>',
        		src: [ 
          			'<%= test_files.js %>',
          			'<%= html2js.tpls.dest %>'
        		]
      		}
		}
	};
	grunt.initConfig( grunt.util._.extend(taskConfig));

  	grunt.registerTask('default',['build','compile']);
  	grunt.registerTask('build', [
    	'clean', 'html2js', 'jshint', 'copy:build_js', 'karmaconfig', 'karma:continuous' 
  	]);
  	grunt.registerTask('compile', [
    	'ngmin', 'concat:compile_js', 'uglify'
  	]);

	/**
   	* A utility function to get all app JavaScript sources.
   	*/
  	function filterForJS(files){
    	return files.filter(function(file){
      		return file.match(/\.js$/);
    	});
  	}

	 /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
	grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function(){
    	var jsFiles = filterForJS(this.filesSrc);
		grunt.verbose.write(jsFiles);
    	grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', { 
      		process: function(contents, path){
        		return grunt.template.process(contents, {
					data: {
						scripts: jsFiles
				  	}
        		});
      		}
    	});
  	});
};
