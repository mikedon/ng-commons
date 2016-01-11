module.exports = {
    compile_js: {
        src: [
            'build/src/**/*.js',
            '<%= html2js.tpls.dest %>',
        ],
        dest: 'dist/<%= package.name %>.js'
    }
}