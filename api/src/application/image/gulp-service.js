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
    view: {
      bust: false,
    },
  },
};
exports.animate = (path, out, imageId) => {
  console.log('\ngulp.animate\n');
  console.log(path);
  return gulp
    .src(path + '/*.svg')
    .pipe(svgSprite(config))
    .pipe(gulp.dest(out));
};

exports.watcher = (path, quantity) => {
  console.log(`watcher path is \n${path}`);
  return gulp.watch(path, function(event) {
    console.log(
      'File ' + event.path + ' was ' + event.type + ', running tasks...'
    );
  });
};
