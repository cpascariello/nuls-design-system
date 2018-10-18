
var watcher;
var styles = function(cb) {

	// get task settings

		var config = require('../gulp.conf.json'),
			env = require('gulp-environments'),
			envName = !!env.production() ? 'prod' : 'dev',
			taskSettings = config.tasks[envName].find(function(v,k) { return v.task === 'styles'; }) || { active: false };

		if(!taskSettings || (taskSettings && !taskSettings.active)) { return; }



	// get and set required vars

		var gulp = require('gulp'),
			gulpif = require('gulp-if'),
			sass = require('gulp-sass'),
			notify = require('gulp-notify'),
			postcss = require('gulp-postcss'),
			plumber = require('gulp-plumber'),
			flatten = require('gulp-flatten'),
			sassGlob = require('gulp-sass-glob'),
			autoprefixer = require('autoprefixer'),
			sourcemaps = require('gulp-sourcemaps');

		var dest = (config.general.dest[envName] || '') + (taskSettings.dest || ''),
			defaults = defaults = {
				"browserSupport": [
					"ie >= 10",
					"last 1 Firefox version",
					"last 1 Chrome version",
					"last 1 Opera version"
				],
				"outputStyle": "compressed"
			},
			browserSupport = taskSettings.options.browserSupport || defaults.browserSupport,
			sassOutputStyle = taskSettings.options.outputStyle || defaults.outputStyle;



	// init watcher

		var browser = require('./browser');
		var reload = !!browser.stream ? browser.stream({ once: true }) : function() { return true; };

		if(!watcher && !env.production() && taskSettings.watch) {

			watcher = gulp.watch(taskSettings.src, { cwd: config.general.src }, styles);
			watcher.on('all', function(event, path, stats) { console.log(path + ': ' + event); });

		}



	// let's go!

		return gulp.src(taskSettings.src, { cwd: config.general.src })
			.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
			.pipe(sassGlob())
			.pipe(env.development(sourcemaps.init()))
			.pipe(sass({ "outputStyle": sassOutputStyle }))
			.pipe(postcss([ autoprefixer({ "cascade": false, "browsers": browserSupport }) ]))
			.pipe(env.development(sourcemaps.write()))
			.pipe(flatten())
			.pipe(gulp.dest(dest))
			.pipe(gulpif(!!browser.stream, env.development(reload)));



};

var gulp = require('gulp');
gulp.task('styles', styles);
