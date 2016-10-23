import { expect } from 'chai';
import configureWebpack, {
  omitWebpack,
  loadCustomWebpack
} from '../../src/config/configure-webpack';
import chalk from 'chalk';
import MockUI from '../helpers/mock-ui';
import { EOL } from 'os';

describe('#configureWebpack', () => {
  
  const ui = new MockUI('DEBUG');
  var config;
  beforeEach(() => {
    config = {
      basePath: __dirname
    };
    ui.clear(); 
  });

  it('should take a config return a new config with webpack dev, prod', () => {
    let newConfig = configureWebpack(config);
    expect(newConfig.dev).to.be.an('object');
    expect(newConfig.prod).to.be.an('object');
  });

  it('should log error if config webpack paths are not defined', () => {
    const string = "Could not load custom webpack config. TypeError: Cannot read property 'dev' of undefined";
    let webpackConfig = loadCustomWebpack(ui, config);
    
    const expected = chalk.red('  error: ') + chalk.white(string);

    expect(ui.errors).to.eql(expected + EOL);
  });

  it('should load custom webpack configs when passed as a path', () => {
    config.webpack = {
      dev: '../fixtures/webpack.config',
      prod: '../fixtures/webpack.prod.config'
    };
    let webpackConfig = loadCustomWebpack(ui, config);
    expect(webpackConfig.dev).to.be.an('object');
    expect(webpackConfig.prod).to.be.an('object');
  });

  
});