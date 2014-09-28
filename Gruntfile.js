/* jshint node: true */
var fs = require('fs');

var UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        build: {
            main: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                css: "toast.css",
                js: "toast.js"
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['build']);
    
    grunt.registerMultiTask('build', function(arg1, arg2){
        var done = this.async(),
            data = this.data;
        
        var jsSource = fs.readFileSync(data.js).toString();
        var cssSource = fs.readFileSync(data.css).toString();
        
        // get minified CSS code
        var cssMini = new CleanCSS().minify(cssSource);
        
        // put the CSS code inside the JS file
        jsSource = jsSource.replace(/{{csscode}}/g, cssMini);
        
        // write the full file for dev/debug purposes
        fs.writeFileSync('toast.full.js', data.banner + jsSource);
        
        // minify the JS code
        var jsMini = UglifyJS.minify(jsSource, { fromString: true }).code;
        
        // write the JS code to the final file
        fs.writeFileSync('toast.min.js', data.banner + jsMini);
        
        done();
    });
};