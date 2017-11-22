const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const del = require('del');
const _ = require('lodash');

module.exports = {};

module.exports.clearDatabase = () => {
  return new Promise((resolve, reject) => {
    del([path.resolve("db")]).then(paths => {
        resolve('Deleted files and folders:\n', paths.join('\n'));
    });
  });
}

module.exports.installMicrodrop = async () {
  return await callCommand("npm install");
}

module.exports.installDeps = async(mode) {
  var deps = getMicrodropDeps();
  let names;

  if (mode == "production") {
    names = _.keys(deps);
  }
  if (mode == "developer") {
    names = _.map(_.values(deps), (d) => path.resolve("packages", d));
  }

  return await callCommand(`npm i ${names.join(" ")}`);
}

module.exports.uninstallDeps = async () => {
  var deps = _.keys(getMicrodropDeps());
  return await callCommand(`npm uninstall ${deps.join(" ")}`);
}

module.exports.callCommand = (command) => {
  return new Promise((resolve, reject) => {
    var child = spawn(command, {stdio: 'inherit', shell: true});
    child.on('exit', function (code) {
      resolve('child process exited with code ' + code.toString());
    });
  });
}

module.exports.getMicrodropDeps = () => {
  var packageJSON = require(path.resolve('package.json'));
  return packageJSON.microdropDependencies;
}

module.exports.getPackages = () => {
  var files = fs.readdirSync(path.resolve("packages"));
  var packages = [];
  for (const [i, package] of files.entries()) {
    var packageDir = path.resolve("packages", package);
    var stats = fs.statSync(packageDir);
    if (stats.isDirectory()) {
      if (fs.existsSync(path.resolve(packageDir,'package.json'))) {
        packages.push(packageDir);
      }
    }
  }
  return packages;
}

module.exports.getPlugins = () => {
  var packages = getPackages();
  var plugins = [];
  for (const [i, package] of packages.entries()) {
    if (fs.existsSync(path.resolve(package,'microdrop.json'))) {
      plugins.push(package);
    }
  }
  return plugins;
}
