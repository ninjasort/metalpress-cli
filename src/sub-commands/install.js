import SubCommand from '../models/sub-command';
import Npm from '../tasks/npm';
import path from 'path';
import fs from 'fs';
import {
  rm,
  mkdir,
  cp
} from 'shelljs';

export default class Install extends SubCommand {
  constructor(options) {
    super();
    this.options = options || {uninstall: false};
    this.npm = new Npm(this.environment);
    this.namespace = 'default';
    this.dest = {
      images: path.resolve(process.cwd(), `src/assets/img/${this.namespace}`),
      sass: path.resolve(process.cwd(), `src/assets/sass/themes/${this.namespace}`),
      js: path.resolve(process.cwd(), `src/assets/js/${this.namespace}`)
    };
  }

  createSrcFolders() {
    const dest = this.dest;
    mkdir('-p', dest.images);
    mkdir('-p', dest.sass);
    mkdir('-p', dest.js);
  }

  copySrcFiles(theme) {
    const dest = this.dest;
    const images = path.resolve(process.cwd(), `node_modules/${theme}/src/assets/img`);
    const sass = path.resolve(process.cwd(), `node_modules/${theme}/src/assets/sass`);
    const js = path.resolve(process.cwd(), `node_modules/${theme}/src/assets/js`);
    
    this.removeSrcFiles();
    this.createSrcFolders();

    // cp('-R', `${images}/`, `${dest.images}`);
    cp('-R', `${sass}/*`, dest.sass);
    cp('-R', `${js}/*`, dest.js);
  }

  removeSrcFiles() {
    const dest = this.dest;
    rm('-rf', dest.images);
    rm('-rf', dest.sass);
    rm('-rf', dest.js);
  }

  applyThemeFiles(theme) {
    this.copySrcFiles(theme);
  }

  run(options) {
    if (this.options.uninstall) {
      return this.npm
        .run('metalpress-theme-default', {
          name: 'uninstall',
          start: 'Uninstalling theme...',
          stop: 'Theme successfully uninstalled.',
          options: '--save-dev'
        })
        .then(() => {
          this.removeSrcFiles();
        })
    } else {
      // look up theme with github api
      // install through npm using git url
      if (options.theme.indexOf('metalpress-theme') < 0) {
        throw new Error('not a valid metalpress theme');
      }
      this.npm
        .run(options.theme, {
          name: 'install',
          start: 'Installing {URL} from github.',
          stop: 'Theme successfully installed.',
          options: '--save-dev'
        })
        .then(() => {
          // sort through files in npm and install them into correct namespaced folders
          this.applyThemeFiles('metalpress-theme-default');
        });
    }
  }
}

// NOTE:
// -----------------------------
// when we uninstall this theme, we're basically going to kill the namespace completely.
// so if someone tried to modify the source and then expects to intelligently uninstall the the theme
// that's not going to be the case. They will basically be wiping out the whole namespace.
// 
// So if I install: `$ metalpress install default`
// 
// I'll get the following folders:
// 
// src
// - assets/img/default
// - assets/fonts/default
// - assets/sass/themes/default
// - data/default
// - pages/default
// - collections/default
// - posts/default
// 
// templates
// - _includes/default
// - _layouts/default
// 
// When I uninstall: `$ metalpress uninstall default`
// 
// I'll lose everything in those default folders. Everything will get killed. 
// You basically break the site, but you should be ready for that.


