//Constantes para el automatizador de tareas
const gulp = require("gulp")
const pug = require('gulp-pug')
const sass = require("gulp-sass")
const babel = require("gulp-babel")
const autoprefixer = require("gulp-autoprefixer")
const concat = require("gulp-concat")
const uglify = require("gulp-uglify")
const plumber = require("gulp-plumber")
const imagemin = require("gulp-imagemin")
const notify = require("gulp-notify")
const webp = require("gulp-webp")

//Constante para el modulo de recarga automática del sitio web al hacer cambios
const browserSync = require('browser-sync')

//Instancia del servidor de desarrollo
const server = browserSync.create()

//Rutas
const paths = {
  images: './dev/assets/img/**/*' 
}

gulp.task('pug', () => {
  return gulp.src('./dev/views/pages/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./public/'))
})

//tarea para los estilos de la UX
gulp.task("styles", () => {
  return gulp
    .src('./dev/scss/styles.scss')
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "compact"
      })
    )
    .pipe(
      autoprefixer()
    )
    .pipe(gulp.dest('./public/css'))
    .pipe(server.stream())
})

//tarea para el js de la UX
gulp.task("babel", () => {
  return gulp
    .src("./dev/js/*.js")
    .pipe(plumber())
    .pipe(
      babel({ presets: [ "@babel/preset-env" ] })
    )
    .pipe(concat("scripts-min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./public/js/"))
})

//Minifica imganes
gulp.task('imagemin', (done) => {
  
  gulp.src(paths.images)
  .pipe(imagemin())
  .pipe(gulp.dest('./public/assets/img'))
  .pipe(notify({message: 'Imagen Minificada'}))
  done()
 })

//Minifica imagenes WebP
gulp.task('webp', (done) => {

  gulp.src(paths.images)
  .pipe(webp())
  .pipe(gulp.dest('./public/assets/img'))
  .pipe(notify({message: 'Versión Webp Lista'}))
  done()
 })

//tarea por defecto para que se ejecuten todas
gulp.task('default', function () {
  //Iniciación del servidor en el puerto 80
  server.init({
    server: './public'
  })

  //Watchers (vigilantes) para vigilar los cambios y mostrarlos en tiempo real
  //PUG
  gulp.watch('./dev/views/**/*.pug', gulp.series('pug')).on('change', server.reload)
  //SCSS
  gulp.watch('./dev/scss/**/*.scss', gulp.series('styles'))

  //JS
  gulp.watch("./dev/js/*.js", gulp.series('babel')).on('change', server.reload)
})
