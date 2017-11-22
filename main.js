const path = require('path');
const _ = require('lodash');
_.extend(global, require('./functions'));

module.exports = (gulp) => {
  gulp.task('get:packages', () => {
    console.log(getPackages());
  });

  gulp.task('get:plugins', function() {
    console.log(getPlugins());
  });

  gulp.task('get:deps', function() {
    console.log(getMicrodropDeps());
  });

  gulp.task('uninstall:deps', async function() {
    return await uninstallDeps();
  });

  gulp.task('install:production', async function() {
    return await installDeps("production");
  });

  gulp.task('install:developer', async function() {
    return await installDeps("developer");
  });

  gulp.task('mode:production', async function() {
    await uninstallDeps();
    return await installDeps("production");
  });

  gulp.task('mode:developer', async function() {
    await uninstallDeps();
    return await installDeps("developer");
  });

  gulp.task('install:microdrop', async function() {
    return await installMicrodrop();
  });

  gulp.task('install:all', async function() {
    const cmd = path.resolve("node_modules/.bin/npm-recursive-install");
    await installMicrodrop();
    await callCommand(cmd);
  });

  gulp.task('start', async function() {
    await callCommand("node index.js");
  });

  gulp.task('reset:db', async function() {
    return await clearDatabase();
  });

  gulp.task('git:add', async function() {

    await callCommand('git add package-lock.json');
    await callCommand('git add -p');
    await callCommand('git commit');

  });
}
