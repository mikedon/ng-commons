module.exports = {
    options: {
        base: 'src',
        module: 'ng-commons-tpls'
    },
    tpls : {
        src: [ '<%= app_files.tpls %>' ],
        dest: 'build/ng-commons-tpls.js'
    }
}