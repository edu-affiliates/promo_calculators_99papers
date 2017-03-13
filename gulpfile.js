'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

gulp.task('browser-sync', function() {
    let config = {
        server: {
            baseDir: "./dist/"
        },
        tunnel: true,
        host: 'localhost',
        port: 7788,
        logPrefix: "cvla"
    };

    browserSync(config);
});

gulp.task('default', ['browser-sync']);
