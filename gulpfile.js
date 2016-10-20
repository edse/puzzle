var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var jade = require('gulp-jade');

gulp.task('scripts', function () {
	return gulp.src('scripts/src/*.js')
	.pipe(uglify())
	.pipe(concat('all.js'))
	.pipe(gulp.dest('dist/'))
});

gulp.task('js-plugins', function (){
	return gulp.src('scripts/plugins.js')
	.pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('dist/'))
});

gulp.task('js-vendor', function (){
	return gulp.src('scripts/vendor.js')
	.pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('dist/'))
});

gulp.task('scripts-watch', function () {
	gulp.watch('scripts/src/*.js', ['scripts'])
});

gulp.task('jade', function () {
	gulp.src('./index.jade')
	.pipe(jade())
	.pipe(gulp.dest('./'))
});

gulp.task('jade-watch', function () {
	gulp.watch('./index.jade', ['jade'])
});

gulp.task('default', ['scripts','scripts-watch','js-plugins','js-vendor','jade','jade-watch']);
