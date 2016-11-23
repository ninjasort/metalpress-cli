import path from 'path'
import fs from 'fs'
import SubCommand from '../models/sub-command'
const browserSync = require('browser-sync').create()
const spinner = require('ora')
const resolve = require('resolve').sync
const basedir = process.cwd()

const metalpressPath = resolve('metalpress', { basedir })
const module = require(metalpressPath)
let metalpress

if (module.default) {
  metalpress = module.default
} else {
  metalpress = module
}

export default class Serve extends SubCommand {
  constructor() {
    super()
    this.serverStarted = false
    this.baseDir = './dist'
    this.config = this.settings.settings || {}
  }

  printUserHelp() {
    this.ui.write(
      'Serves a metalpress project on a browser-sync server (default: http://localhost:3000)\n'
    );
  }

  build(cb) {
    const loading = spinner('Building site...').start()
    metalpress(this.config, (err) => {
      if (err) throw new Error(err)
      loading.succeed()
      cb()
    })
  }

  watch() {
    const settings = {
      ghostMode: {
        clicks: true,
        scroll: true,
        links: true,
        forms: true
      },
      server: path.resolve(process.cwd(), this.baseDir)
    };
    
    let srcFiles = path.resolve(process.cwd(), 'src')
    let layoutFiles = path.resolve(process.cwd(), 'templates/_layouts')
    let includeFiles = path.resolve(process.cwd(), 'templates/_includes')
    
    browserSync.watch(`${srcFiles}/**`)
      .on('change', () => this.build(browserSync.reload))
    browserSync.watch(`${layoutFiles}/*.liquid`)
      .on('change', () => this.build(browserSync.reload))
    browserSync.watch(`${includeFiles}/**/*.liquid`)
      .on('change', () => this.build(browserSync.reload))

    browserSync.init(settings)
  }

  run() {
    this.build(() => this.watch())
  }
}