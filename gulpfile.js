/* package */
const { src, dest, watch, series, parallel } = require("gulp");
// const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const sassGlob = require("gulp-sass-glob");
const mmq = require("gulp-merge-media-queries");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssdeclsort = require("css-declaration-sorter");
const cleanCSS = require("gulp-clean-css");
const cssnext = require("postcss-cssnext")
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");


const themeName = "WordPressTheme"; // WordPress theme name
const srcPath = {
	css: './sass/**/*.scss',
}
const destPath = {
	css: `./${themeName}/assets/css`,
}
/* compile sass */
// gulp.task("sass", function() {
// return gulp


const cssSass = () => {
	return src(srcPath.css)
		.pipe(sourcemaps.init())
		.pipe(
			plumber({
				errorHandler: notify.onError('Error:<%= error.message %>')
			}))
		.pipe(sassGlob())
		.pipe(sass({ outputStyle: 'expanded' })) //指定できるキー expanded compressed
		.pipe(postcss([autoprefixer({ // autoprefixer
			grid: true
		})]))
		.pipe(postcss([cssdeclsort({ // sort
			order: "alphabetical"
		})]))
		.pipe(mmq()) // media query mapper
		.pipe(dest(destPath.css))
		.pipe(cleanCSS())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(sourcemaps.write('./map'))
		.pipe(dest(destPath.css))
		.pipe(notify({
			message: 'Sassをコンパイルしました！',
			onLast: true
		}))
}


const watchFiles = () => {
	watch(srcPath.css, series(cssSass))
	// watch(srcPath.img, series(imgImagemin))
}
exports.default = series(series(cssSass), parallel(watchFiles));
