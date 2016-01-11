module.exports = function(grunt, options){
    grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function(){
        function filterForJS(files){
            return files.filter(function(file){
                return file.match(/\.js$/);
            });
        }

        var jsFiles = filterForJS(this.filesSrc);
        grunt.verbose.write(jsFiles);
        grunt.file.copy('karma/karma-unit.tpl.js', 'build/karma-unit.js', {
            process: function(contents, path){
                return grunt.template.process(contents, {
                    data: {
                    scripts: jsFiles
                    }
                });
            }
        });
    });
    return {
        unit: {
            dir: 'build',
            src: [
                '<%= test_files.js %>',
                '<%= html2js.tpls.dest %>'
            ]
        }
    }
}