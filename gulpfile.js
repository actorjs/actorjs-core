'use strict';

var gulp = require('gulp');
var webpack = require("webpack");
var babel = require("gulp-babel");


var webpackConfig = require("./webpack.config");

gulp.task("webpack", function(callback) {
    var myConfig = Object.create(webpackConfig);
    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("babel", function () {
    return gulp.src("src/app.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});