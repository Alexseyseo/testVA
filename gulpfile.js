var gulp = require("gulp");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var del = require("del");
var sass = require("gulp-sass");
var csso = require("gulp-csso");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var server = require("browser-sync").create();

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
      "src/fonts/**/*.{woff2,woff,otf}",
      "src/img/**"
    ], {
      base: "src"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("bootstrap", function () {
  return gulp.src("node_modules/bootstrap/scss/bootstrap-grid.scss")
    .pipe(sass())
    .pipe(csso())
    .pipe(rename("bootstrap-grid.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("slick", function () {
  return gulp.src("node_modules/slick-carousel/slick/slick.css")
    .pipe(csso())
    .pipe(rename("slick.min.css"))
    .pipe(gulp.dest("build/slick"))
    .pipe(gulp.src("node_modules/slick-carousel/slick/slick-theme.css"))
    .pipe(csso())
    .pipe(rename("slick-theme.min.css"))
    .pipe(gulp.dest("build/slick"))
    .pipe(gulp.src([
      "node_modules/slick-carousel/slick/slick.min.js",
      "node_modules/slick-carousel/slick/fonts/**",
      "node_modules/slick-carousel/slick/ajax-loader.gif"
    ],  {
      base: "node_modules/slick-carousel/slick/"
    }))
    .pipe(gulp.dest("build/slick"));
});

gulp.task("js", function () {
  return gulp.src(["src/js/*.js", "node_modules/jquery/dist/jquery.min.js"])
    .pipe(gulp.dest("build/js"));
});

gulp.task("images", function () {
  return gulp.src("src/img/**/*.png")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("src/img"));
});

gulp.task("webp", function () {
  return gulp.src("src/img/**/*.{png,jpg}")
    .pipe(webp({quality: 100}))
    .pipe(gulp.dest("src/img"));
});

gulp.task("refresh", function (done) {
 server.reload();
 done();
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "js",
  "slick",
  "bootstrap",
  "html"
));

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/js/*.js", gulp.series("js", "refresh"));
  gulp.watch("src/sass/**/*.scss", gulp.series("css", "refresh"));
  gulp.watch("src/*.html", gulp.series("html", "refresh"));
});

gulp.task("start", gulp.series("build", "server"));
