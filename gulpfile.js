const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");


// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

//JSmin

const jsmin = require("gulp-jsmin");

const jsminify = () => {
  return gulp.src("source/js/*.js")
    .pipe(jsmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("build/js"))
}

//Imagemin

const imagemin = require("gulp-imagemin");

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg} ")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ progessive: true }),
      imagemin.svgo()
    ]))
}

//WebP

const webp = require("gulp-webp");

const webpimg = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"))
}


//SvgStore

const svgstore = require("gulp-svgstore");

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))

}


//Del

const del = require("del");

const clean = () => {
  return del("build")
};

//Copy

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico",
    "source/*.html"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
};

//Build

const build = gulp.series(clean, copy, styles, jsminify, images, webpimg, sprite);

exports.build = build;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);

