
var watcher;
var copy = function(cb) {

	// get task settings

		var config = require('../gulp.conf.json'),
			env = require('gulp-environments'),
			envName = !!env.production() ? 'prod' : 'dev',
			taskSettings = config.tasks[envName].find(function(v,k) { return v.task === 'copy'; }) || { active: false };

		if(!taskSettings || (taskSettings && !taskSettings.active)) { return; }



	// get and set required vars

		var gulp = require('gulp'),
			gulpif = require('gulp-if'),
			notify = require('gulp-notify'),
			plumber = require('gulp-plumber'),
			flatten = require('gulp-flatten'),
			changed = require('gulp-changed');

		var dest = (config.general.dest[envName] || '') + (taskSettings.dest || '');



	// init watcher

		var browser = require('./browser');
		var reload = !!browser.stream ? browser.stream({ once: true }) : function() { return true; };

		if(!watcher && !env.production() && taskSettings.watch) {

			watcher = gulp.watch(taskSettings.src, { cwd: config.general.src }, copy);
			watcher.on('all', function(event, path, stats) { console.log(path + ': ' + event); });

		}



	// let's go!

		return gulp.src(taskSettings.src, { cwd: config.general.src })
			.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
			.pipe(flatten({ includeParents: -1 }))
			.pipe(changed(dest, { hasChanged: changed.compareLastModifiedTime }))
			.pipe(gulp.dest(dest))
			.pipe(gulpif(!!browser.stream, env.development(reload)));



};

var gulp = require('gulp');
gulp.task('copy', copy);
