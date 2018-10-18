
var watcher;
var icons = function(cb) {

	// get task settings

		var config = require('../gulp.conf.json'),
			env = require('gulp-environments'),
			envName = !!env.production() ? 'prod' : 'dev',
			taskSettings = config.tasks[envName].find(function(v,k) { return v.task === 'icons'; }) || { active: false };

		if(!taskSettings || (taskSettings && !taskSettings.active)) { return; }



	// get and set required vars

		var gulp = require('gulp'),
			gulpif = require('gulp-if'),
			notify = require('gulp-notify'),
			plumber = require('gulp-plumber'),
			flatten = require('gulp-flatten'),
			svgSprite = require('gulp-svg-sprite');

		var dest = (config.general.dest[envName] || '') + (taskSettings.dest || ''),
			options = {
				svg: {
					xmlDeclaration: false,
					doctypeDeclaration: false,
					namespaceClassnames: false,
					dimensionAttributes: false,
					rootAttributes: { class: 'theSprite' },
					transform: [function(svg) { return svg.replace(/fill=\"(?!currentColor)(.*?)\"/ig, 'fill="currentColor"'); }]
				},
				shape: {
					id: {
						generator: function(name) {

							var dirs = name.split('/');
							var fileName = dirs[dirs.length - 1];

							return 'symbol--' + fileName.split('.')[0];

						}
					},
					dimension: {
						maxWidth: 32,
						maxHeight: 32
					},
					spacing: {
						padding: 0,
						box: 'content'
					}
				},
				mode: {
					symbol: {
						dest: '',
						prefix: '.%s',
						sprite: '',
						inline: false,
						dimensions: false
					}
				}
			};



	// init watcher

		var browser = require('./browser');
		var reload = !!browser.stream ? browser.stream({ once: true }) : function() { return true; };

		if(!watcher && !env.production() && taskSettings.watch) {

			watcher = gulp.watch(taskSettings.src, { cwd: config.general.src }, icons);
			watcher.on('all', function(event, path, stats) { console.log(path + ': ' + event); });

		}



	// let's go!

		return gulp.src(taskSettings.src, { cwd: config.general.src })
			.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
			.pipe(svgSprite(options))
			.pipe(gulp.dest(dest))
			.pipe(gulpif(!!browser.stream, env.development(reload)));



};

var gulp = require('gulp');
gulp.task('icons', icons);
