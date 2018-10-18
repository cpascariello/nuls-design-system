
// settings

	var config = require('../gulp.conf.json'),
		taskFolder = './',
		tasks = [];



// check environment

	var environments = require('gulp-environments'),
		env = !!environments.production() ? 'prod' : 'dev';



// get tasks

	var requireDir = require('require-dir'),
		taskDir = requireDir(taskFolder, { recurse: true });

	if(!config.tasks[env]) {

		console.log('No settings found for "' + env + '" environment.');

	} else {

		[].forEach.call(config.tasks[env], function(task) {

			if(task.active && (!task.env || task.env.indexOf(env) > -1)) { tasks.push(task.task); }

		});

	}



// validate tasklist

	if(tasks.length) {

		tasks.unshift('clean');

	} else {

		tasks.push(function(cb) {

			console.log('No active tasks, check your ./gulp.conf.json file.');
			if(typeof(cb) === typeof(function(){})) { cb(); }

		});

	}



// publish

	var gulp = require('gulp');
	gulp.task('default', gulp.series(tasks));


