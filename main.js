const path = require('path');
const _ = require('lodash');
const {spawnSync, spawn, exec} = require('child_process');
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
    console.log("Launching jupyterlab");
    exec('jupyter lab');
    console.log("Launching microdrop");
    callCommand("node index.js");
  });

  gulp.task('reset:db', async function() {
    return await clearDatabase();
  });

  gulp.task('git:add', async function() {
    await callCommand('git add package-lock.json');
    await callCommand('git add -p');
    await callCommand('git commit');
  });

  gulp.task('reinstall:buildutils', async () => {
    await callCommand('npm un @microdrop/buildutils');
    await callCommand('npm i @microdrop/buildutils');
  });


  gulp.task('publish', async function(){
    await callCommand('gulp mode:production');
    await callCommand('gulp build');
    await callCommand('npm version patch');
    await callCommand('npm publish');
    await callCommand('git push origin master');
  });

  gulp.task('build:dev', () => buildDev("packages"));

}
