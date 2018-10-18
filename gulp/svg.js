
var watcher;
var svg = function(cb) {

	// get task settings

		var config = require('../gulp.conf.json'),
			env = require('gulp-environments'),
			envName = !!env.production() ? 'prod' : 'dev',
			taskSettings = config.tasks[envName].find(function(v,k) { return v.task === 'svg'; }) || { active: false };

		if(!taskSettings || (taskSettings && !taskSettings.active)) { return; }



	// get and set required vars

		var gulp = require('gulp'),
			gulpif = require('gulp-if'),
			notify = require('gulp-notify'),
			svgmin = require('gulp-svgmin'),
			plumber = require('gulp-plumber'),
			flatten = require('gulp-flatten');

		var dest = (config.general.dest[envName] || '') + (taskSettings.dest || ''),
			defaults = {
				"plugins": [
					{ removeDoctype: true },
					{ removeComments: true },
					{ removeDimensions: true },
					{ convertShapeToPath: true },
					{ convertStyleToAttrs: true },
					{ cleanupNumericValues: { floatPrecision: 0 } }
				]
			},
			plugins = taskSettings.options && taskSettings.options.plugins ? taskSettings.options.plugins : defaults.plugins;



	// init watcher

		var browser = require('./browser');
		var reload = !!browser.stream ? browser.stream({ once: true }) : function() { return true; };

		if(!watcher && !env.production() && taskSettings.watch) {

			watcher = gulp.watch(taskSettings.src, { cwd: config.general.src }, svg);
			watcher.on('all', function(event, path, stats) { console.log(path + ': ' + event); });

		}



	// let's go!

		return gulp.src(taskSettings.src, { cwd: dest })
			.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
			.pipe(flatten())
			.pipe(svgmin(plugins))
			.pipe(gulp.dest(dest))
			.pipe(gulpif(!!browser.stream, env.development(reload)));



};

var gulp = require('gulp');
gulp.task('svg', svg);
