import path from 'path';
import fs from 'fs';
import SubCommand from '../models/sub-command';
import browserSync from 'browser-sync';

var resolve = require('resolve').sync;
var basedir = process.cwd();

var metalpressPath = resolve('metalpress', { basedir });
var module = require(metalpressPath);
if (module.default) {
  var metalpress = module.default;
} else {
  var metalpress = module;
}

export default class Serve extends SubCommand {
  constructor() {
    super();
    this.serverStarted = false;
    this.baseDir = './dist';
    this.config = this.settings.settings || {};
  }

  printUserHelp() {
    this.ui.write('Serves a metalpress project on a browser-sync server (default: http://localhost:3000)\n');
  }

  build() {
    metalpress(
      this.config, 
      this.watch.bind(this, this.baseDir)
    );
  }

  watch(server) {
    const settings = {
      ghostMode: {
        clicks: true,
        scroll: true,
        links: true,
        forms: true
      },
      server
    };

    browserSync.watch('src/**', () => build(browserSync.reload));
    browserSync.watch('templates/_layouts/*.liquid', () => build(browserSync.reload));
    browserSync.watch('templates/_includes/**/*.liquid', () => build(browserSync.reload));

    browserSync.init(settings);
  }

  run() {
    this.build();
  }
}