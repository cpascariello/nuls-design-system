
var clean = function(cb) {

	var config = require('../gulp.conf.json'),
		del = require('del'),
		env = require('gulp-environments'),
		envName = !!env.production() ? 'prod' : 'dev';

	del(config.general.dest[envName] + config.general.assets, { force: true });
	del(config.general.dest[envName] + config.general.components, { force: true });
	setTimeout(cb, 1000);

};

var gulp = require('gulp');
gulp.task(clean);
