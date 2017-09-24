// including plugins
var gulp = require('gulp')
, uglify = require("gulp-uglify")
, concat=require("gulp-concat");
 
// task
gulp.task('minify-js', function () {
    gulp.src('assets/final/*.js') // path to your files
	.pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/final/'));
});