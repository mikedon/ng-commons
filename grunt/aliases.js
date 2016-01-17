module.exports = {
    default: ['compile'],
    build: ['clean', 'ts', 'html2js'],
    unit: ['build', 'karmaconfig', 'karma:unit'],
    compile: ['unit', 'concat:compile_js', 'uglify', 'concat:dist_tsd']
}