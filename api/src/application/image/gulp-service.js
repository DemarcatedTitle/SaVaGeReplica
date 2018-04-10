var gulp = require('gulp');
var svgSprite = require('gulp-svg-sprite');

const config = {
  mode: {
    css: {
      render: {
        css: true,
      },
      layout: 'horizontal',
    },
  },
};
exports.animate = (path, imageId) =>
  gulp
    .src(path + '/*.svg')
    .pipe(svgSprite(config))
    .pipe(gulp.dest('out'));
