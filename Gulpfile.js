(function(){
  'use strict';

  var gulp = require('gulp');
  var sass = require('gulp-sass');
  var connect = require('connect');
  var serveStatic = require('serve-static')
  var livereload = require('gulp-livereload');
  var connectLivereload = require('connect-livereload');
  var opn = require('opn');

  var bower = require('gulp-bower');
  var handlebars = require('gulp-handlebars');
  var wrap = require('gulp-wrap');
  var declare = require('gulp-declare');
  var concat = require('gulp-concat');

  var babelify = require('babelify');
  var browserify = require('browserify');
  var browserifyHandlebars = require('browserify-handlebars');
  var source = require('vinyl-source-stream');

  /*
   * ---------->  Main Config  <-------------
   */
  var config = {
    rootDir: __dirname,
    servingPort: 3000,

    entry: './src/js/app.js',
    template: 'templates.js',
    output: 'app.bundle.js',

    srcHtmlPath: ['./src/**/*.html'],
    srcScssPath: ['./src/scss/*.scss' ],
    srcJSPath: ['./src/js/*.js', '!Gulpfile.js'],
    srcHandlebarsPath: ['./src/handlebars/*.hbs', './src/handlebars/*.handlebars'],

    buildHtmlPath: './build/',
    buildScssPath: './build/css/',
    buildJSPath: './build/js/',
    buildBowerPath: './build/bower_components/',
  };

  gulp.task('browserify', function() {
    browserify({
      entries: config.entry,
      debug: true,
      transform: [browserifyHandlebars],
      browserifyOptions: {
         debug: true
      }
    })
    .transform( babelify.configure({
      ignore: "bower_components",
      extensions: ['.js']
    }))
    .bundle()
    .pipe(source(config.output))
    .pipe(gulp.dest(config.buildJSPath))
    .pipe(livereload());
  });

  gulp.task('handlebars', function() {
    /*
    gulp.src(config.srcHandlebarsPath)
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'App.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat(config.template))
    .pipe(gulp.dest(config.buildJSPath));
    */
  });


  gulp.task('bower', function() {
    return bower()
    .pipe(gulp.dest(config.buildBowerPath));
  });

  gulp.task('html', function () {
    gulp.src(config.srcHtmlPath)
    .pipe(gulp.dest(config.buildHtmlPath))
    .pipe(livereload());
  });

  gulp.task('html:watch', function () {
    gulp.watch(config.srcHtmlPath, ['html']);
  });

  gulp.task('sass', function () {
    gulp.src(config.srcScssPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.buildScssPath))
    .pipe(livereload());
  });

  gulp.task('sass:watch', function () {
    gulp.watch(config.srcScssPath, ['sass']);
  });

  gulp.task('js', function () {
    // gulp.src(config.srcJSPath)
    // .pipe(gulp.dest(config.buildJSPath))
    // .pipe(livereload());
  });

  gulp.task('js:watch', function () {
    gulp.watch(config.srcJSPath, ['js', 'browserify']);
  });

  // `gulp watch` task watching for file changes
  gulp.task('watch', ['html:watch', 'sass:watch', 'js:watch', 'build'], function () {
    livereload.listen();
  });

  // `gulp serve` task loading the URL in your browser
  gulp.task('serve', ['connect'], function () {
    console.log('--> http://localhost:' + config.servingPort);
    return opn('http://localhost:' + config.servingPort);
  });

  // `gulp connect` task starting your server
  gulp.task('connect', function(){
    return connect()
    .use(connectLivereload())
    .use(serveStatic(config.buildHtmlPath))
    .listen(config.servingPort);
  });

  // The default task - called when you run `gulp` from CLI
  gulp.task('default', ['html', 'sass', 'js', 'watch', 'build', 'serve']);
  gulp.task('build', ['bower', 'handlebars', 'browserify']);

}());
