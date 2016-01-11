module.exports = {
    build_js: {
        files: [{
            src: [ '<%= app_files.js %>' ],
            dest: 'build/',
            cwd: '.',
            expand: true
        }]
    }
}