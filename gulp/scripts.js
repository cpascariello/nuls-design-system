
var watcher;
var scripts = function(cb) {

	// get task settings

		var config = require('../gulp.conf.json'),
			env = require('gulp-environments'),
			envName = !!env.production() ? 'prod' : 'dev',
			taskSettings = config.tasks[envName].find(function(v,k) { return v.task === 'scripts'; }) || { active: false };

		if(!taskSettings || (taskSettings && !taskSettings.active)) { return; }



	// get and set required vars

		var gulp = require('gulp'),
			gulpif = require('gulp-if'),
			babel = require('gulp-babel'),
			uglify = require('gulp-uglify'),
			concat = require('gulp-concat'),
			notify = require('gulp-notify'),
			plumber = require('gulp-plumber'),
			sourcemaps = require('gulp-sourcemaps');

		var dest = (config.general.dest[envName] || '') + (taskSettings.dest || ''),
			defaults = { "filename": "scripts.js" },
			fileName = taskSettings.options && taskSettings.options.filename && taskSettings.options.filename.length ? taskSettings.options.filename : defaults.filename;



	// init watcher

		var browser = require('./browser');
		var reload = !!browser.stream ? browser.stream({ once: true }) : function() { return true; };

		if(!watcher && !env.production() && taskSettings.watch) {

			watcher = gulp.watch(taskSettings.src, { cwd: config.general.src }, scripts);
			watcher.on('all', function(event, path, stats) { console.log(path + ': ' + event); });

		}



	// let's go!

		return gulp.src(taskSettings.src, { cwd: config.general.src })
			.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
			.pipe(env.development(sourcemaps.init()))
			.pipe(babel())
			.pipe(concat(fileName))
			.pipe(env.development(sourcemaps.write()))
			.pipe(env.production(uglify()))
			.pipe(gulp.dest(dest))
			.pipe(gulpif(!!browser.stream, env.development(reload)));



};

var gulp = require('gulp');
gulp.task('scripts', scripts);
