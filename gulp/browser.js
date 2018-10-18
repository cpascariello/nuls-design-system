
var browser = function(cb) {

	// get task settings

		var config = require('../gulp.conf.json'),
			env = require('gulp-environments'),
			envName = !!env.production() ? 'prod' : 'dev',
			taskSettings = config.tasks[envName].find(function(v,k) { return v.task === 'browser'; }) || { active: false };

		if(!taskSettings || (taskSettings && !taskSettings.active)) { return; }
		if(env.production()) { console.log('Browser-sync is skipped in the production environment.'); return; }



	// get and set required vars

		var gulp = require('gulp'),
			browserSync = require('browser-sync').create();

		var defaults = { "port": 9999, "online": true, "notify": true };



	// reload browsers

		browserSync.init({
			"port": taskSettings.options.port || defaults.port,
			"online": taskSettings.options.online || defaults.online,
			"notify": taskSettings.options.notify || defaults.notify
		});

		cb();



};

var gulp = require('gulp');
gulp.task('browser', browser);
