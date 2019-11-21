/**
  * Author: stancer 
  * E-Mail: nikita.kruchinkin@gmail.com
  * Description: default gulpfile.js for most typical projects
  *
*/


var gulp = require('gulp'),
  pug = require('gulp-pug'),
  less = require('gulp-less'),
  postcss = require('gulp-postcss'),
  mqpacker = require('css-mqpacker'),
  concat = require('gulp-concat'),
  autoprefixer = require('autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  browserSync = require('browser-sync'), 
  jsmin = require('gulp-jsmin'),
  imagemin = require('gulp-imagemin'), 
  pngquant = require('imagemin-pngquant'), 
  fileinclude = require('gulp-file-include'),
  cssnano = require('gulp-cssnano'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  zip = require('gulp-zip'),
  svgstore = require('gulp-svgstore'),
  svgmin = require('gulp-svgmin'),
  cheerio = require('gulp-cheerio'),
  size = require('gulp-size'),
  rename = require('gulp-rename');

// Компиляция LESS
gulp.task('less', function() { 
  console.log('---------- Компиляция LESS');
  return gulp.src('src/less/*.less') // Берем less только с первого уровня
    .pipe(concat('bundle.css'))
    .pipe(less()) // Преобразуем LESS в CSS посредством gulp-less
    .on('error', notify.onError(function(err) {  // Отлавливаем ошибки компиляции
      return {
        title: 'Styles compilation error',
        message: err.message
      }
    }))
    .pipe(cleanCSS()) // чистим css
    .pipe(postcss([
      autoprefixer({browsers: ['last 10 version']}), // вендорные префиксы
      mqpacker({sort: true}), // конкатенация media query
    ]))
    .pipe(gulp.dest('./docs/css/')) // Выгружаем результата в папку docs/css
    .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});


// Сборка и минификация CSS библиотек
gulp.task('libs', function() {
  console.log('---------- Минификация CSS библиотек');
  
  gulp.src('src/libs/css/*.css') // Берем less только с первого уровня
      .pipe(concat('libs.min.css')) // Собираем их в кучу в новом файле libs.min.css
      .pipe(cssnano()) // Сжимаем
      .pipe(gulp.dest('./docs/css')); // Выгружаем в папку docs/css

  gulp.src('src/libs/js/*.js') // Берем less только с первого уровня
      .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.css
      .pipe(jsmin()) // Сжимаем
      .pipe(gulp.dest('./docs/js/')); // Выгружаем в папку docs/css
});

// Сборка и минификация собственного JS для продакшена
gulp.task('js', function () {
  return gulp.src('./src/js//*.js') //собираем все js файлы
    .pipe(concat('bundle.js')) 
    .pipe(jsmin())
    .pipe(gulp.dest('./docs/js/'))
    .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
});

//Сборка 
gulp.task('svg', function (callback) {
  let spritePath = 'src/svg/';
  if(fileExist(spritePath) !== false) {
    console.log('---------- Сборка SVG спрайта');
    return gulp.src(spritePath + '*.svg')
      .pipe(svgmin(function (file) {
        return {
          plugins: [{
            cleanupIDs: {
              minify: true
            }
          }]
        }
      }))
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(cheerio(function ($) {$('svg').attr('style',  'display:none');}))
      .pipe(rename('sprite.svg'))
      .pipe(size({
        title: 'Размер',
        showFiles: true,
        showTotal: false,
      }))
      .pipe(gulp.dest('docs/svg/'))
      .pipe(browserSync.reload({stream: true}));
  } else {
    console.log('---------- Сборка SVG спрайта: нет папки с картинками');
    callback();
  }
});

// Собираем html из _html и помещаем в корень
gulp.task('html', function() {
  console.log('---------- c HTML');
  gulp.src('src/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(gulp.dest('./docs/'))
    .pipe(browserSync.reload({
      stream: true}
    ));
});

// Pug
gulp.task('pug', function () {
  return gulp.src('./src/pug/*.pug')
  .pipe(pug({
      pretty: true
  }))
  .pipe(gulp.dest('./docs/'))           
  .pipe(browserSync.reload({
      stream: true              
  }));
});


// Оптимизация изображений
gulp.task('img', function() {
  console.log('---------- Копирование и оптимизация картинок');
    return gulp.src('src/img/*.*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('docs/img')); // Выгружаем на продакшен
});

// Таск Browser-sync
gulp.task('browser-sync', function() { 
  browserSync({ 
    server: { baseDir: 'docs' }, // Директория для сервера - docs
    notify: false // Отключаем уведомления
  });
});

// LiveReload
gulp.task('watch', ['browser-sync','pug','less','js'], function() {
  gulp.watch('src/less/**/*.less', ['less']); // Наблюдение за less файлами
  gulp.watch('src/pug/**/*.pug', ['pug']); // Наблюдение за HTML файлами в проекте
  gulp.watch('src/**/*.html', ['html']); // Наблюдение за PUG файлами в проекте
  gulp.watch('src/js/*.js', ['js']); // Наблюдение за JS файлами в папке js
  gulp.watch('src/img/*', ['img']); // Наблюдение за JS файлами в папке js
});

// Проверка существования файла
function fileExist(path) {
  const fs = require('fs');
  try {
    fs.statSync(path);
  } catch(err) {
    return !(err && err.code === 'ENOENT');
  }
}