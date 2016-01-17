module.exports = {
    compile_js: {
        src: [
            'build/src/**/*.js',
            '<%= html2js.tpls.dest %>',
        ],
        dest: 'dist/<%= package.name %>.js'
    },
    dist_tsd: {
        src: ['build/src/**/*.d.ts'],
        dest: 'dist/<%= package.name %>.d.ts'
    }
}