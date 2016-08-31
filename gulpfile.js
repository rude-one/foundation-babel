var gulp = require('gulp');
var browserSync  = require('browser-sync').create();
var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require('vinyl-source-stream');
var plugins = require('gulp-load-plugins')();
var gutil = require('gulp-util');
var minifycss    = require('gulp-minify-css');
var tplTransform = require('node-underscorify').transform({
        extensions: ['html']
    });

var env_name = JSON.parse(fs.readFileSync('./env.json'));

gulp.task('js', function() {
	browserify({ debug: true })
		.transform(babelify)
		.transform(tplTransform)
		.require("./assets/js/app.js", { entry: true })
		.bundle()
		.on('error',gutil.log)
		.pipe(source('bundle.js'))
    	.pipe(gulp.dest('./assets/js/bundle'))
        .pipe(browserSync.stream());
});

gulp.task('sass', function() {
    return gulp.src('./assets/scss/**.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .on('error', gutil.log)
        .pipe(minifycss())
        .pipe(plugins.sourcemaps.write(undefined, { sourceRoot: null }))
        .pipe(gulp.dest("./assets/css"))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe(browserSync.stream())
});


 
gulp.task('default', ['js','sass','serve']);

gulp.task('serve', function() {
    browserSync.init({
        proxy:  env_name.env
    });
    gulp.watch(['./assets/js/app.js'],['js'])
	gulp.watch(['./assets/scss/**.scss'],['sass'])
	gulp.watch("**/**.html").on('change', browserSync.reload);
});