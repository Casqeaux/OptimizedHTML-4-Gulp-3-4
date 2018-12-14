var syntax        = 'sass', // Syntax: sass or scss;
		gulpversion   = '4'; // Gulp version: 3 or 4


var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		del 					= require('del'),
		rsync         = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: true,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

if (gulpversion == 3) {
	gulp.task('watch', ['styles', 'scripts', 'browser-sync'], function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['styles']);
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
		gulp.watch('app/*.html', ['code'])
	});
	gulp.task('default', ['watch']);
}

if (gulpversion == 4) {
	gulp.task('watch', function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
		gulp.watch('app/*.html', gulp.parallel('code'))
	});
	gulp.task('default', gulp.parallel('watch', 'styles', 'scripts', 'browser-sync'));
}




gulp.task('scripts', function(){
	return gulp.src([// Берем все необходимые библиотеки
   'app/libs/jquery/dist/jquery.min.js',// Берем jQuery
		])
	.pipe(concat('libs.min.js'))// Собираем их в кучу в новом файле libs.min.js
	.pipe(uglify())// Сжимаем JS файл
	.pipe(gulp.dest('app/js'));// Выгружаем в папку app/js
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')// Берем все изображения из app

	.pipe(gulp.dest('dist//img'));// Выгружаем на продакшен
});

gulp.task('libs', function() {
	return gulp.src('app/libs/**/*')// Берем все изображения из app

	.pipe(gulp.dest('dist//libs'));// Выгружаем на продакшен
});

gulp.task('html', function() {
  return gulp.src('app/*.html')
	
	.pipe(gulp.dest('dist'));
});	

gulp.task('css', function() {
  return gulp.src('app/**/*.css')
	
	.pipe(gulp.dest('dist/'));
});	

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
	
	.pipe(gulp.dest('dist/fonts')); 
});	

gulp.task('js', function() {
  return gulp.src('app/js/**/*')
	
	.pipe(gulp.dest('dist/js'));
});	

gulp.task('clean', function() {
	return del.sync('dist/**/*');// Удаляем папку dist перед сборкой
});

gulp.task('build', gulp.parallel('clean', 'html','js','css', 'libs',"fonts", 'img', 'styles', 'scripts'), function() {

gulp.task('clean', function() {
	return del.sync('dist/**/*');// Удаляем папку dist перед сборкой
});

});