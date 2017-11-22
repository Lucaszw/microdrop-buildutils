const _ = require('lodash');

module.exports = (gulp) => {
  require('./main')(gulp);

  // Overrides
  installDeps = async (mode) => {
    return (await _installDeps(mode, ".."));
  }

  gulp.task('get:packages', _.noop);
  gulp.task('get:plugins', _.noop);
  gulp.task('build', build);
  gulp.task('build:dev', ()=>buildDev(".."));

}
