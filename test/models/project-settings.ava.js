import ProjectSettings from 'models/project-settings'
import fs from 'fs'
import fse from 'fs-extra'
import config from 'config'
import { fileExists } from 'util/fs'
import path from 'path'
import pmock from 'pmock'
import test from 'ava'

const { basePath } = config
const settingsPath = basePath + '/src/.metalpress'
const templatePath = basePath + '/src/templates/.metalpress'

let cwd, settings

test.before(t => {
  cwd = pmock.cwd(path.resolve(__dirname, '../../src'))
})

test.beforeEach(t => {
  settings = new ProjectSettings()
  fileExists(settingsPath) && fse.removeSync(settingsPath)
})

test.afterEach(t => {
  fileExists(settingsPath) && fse.removeSync(settingsPath)
})

test.after(t => {
  cwd.reset()
})

test('ProjectSettings - returns current directory with .metalpress appended', t => {
  t.is(settings.settingsPath(), settingsPath)
})

test('ProjectSettings#settingsExist - returns true when settings exist', t => {
  fs.writeFileSync(settingsPath, 'settings')
  t.is(settings.settingsExist(), true)
})

test('ProjectSettings#settingsExist - returns false when settings are not present', t => {
  t.is(settings.settingsExist(), false)
})

test('ProjectSettings#templatePath - returns current directory with proper template appended', t => {
  t.is(settings.templatePath(), templatePath)
})

test('ProjectSettings#buildFromTemplate - can take a custom path in constructor for different configs', t => {
  settings = new ProjectSettings('../../src/templates/.metalpress')
  const expectedPath = `${basePath}/src/templates/.metalpress`
  
  t.is(settings.templatePath(), expectedPath)
})

test('ProjectSettings#buildFromTemplate - doesnt have .metalpress already present', t => {
  const error = t.throws(() => {
    fs.readFileSync(settingsPath)
  }, Error)
})

test('ProjectSettings#buildFromTemplate - copies .metalpress in templates and makes copy in directory root', t => {
  settings.buildFromTemplate()

  const template = fs.readFileSync(templatePath)
  const rc = fs.readFileSync(settingsPath)
  
  t.truthy(rc)
  t.deepEqual(rc, template)
  
  fs.unlinkSync(settingsPath)
})

test('ProjectSettings#loadSettings - loads settings from .metalpress if already exists', t => {
  fs.writeFileSync(
      settingsPath, JSON.stringify({ test: 'works!' })
    )
  settings = new ProjectSettings()
  t.is(settings.getSetting('test'), 'works!')
})

test('ProjectSettings#loadSettings - creates a new .metalpress if not present', t => {
  new ProjectSettings()
  
  const template = fs.readFileSync(templatePath)
  const rc = fs.readFileSync(settingsPath)
  t.deepEqual(rc, template)
})

test('ProjectSettings#getSetting - returns the value of that setting', t => {
  const mockedSettings = {
    testOne: 'works',
    testTwo: 'works as well!'
  }
  fs.writeFileSync(settingsPath, JSON.stringify(mockedSettings))

  settings = new ProjectSettings()
  t.is(settings.getSetting('testOne'), 'works')
  t.is(settings.getSetting('testTwo'), 'works as well!')
})

test('ProjectSettings#getAllSettings - returns json of all settings', t => {
  const mockedSettings = {
    testOne: 'works',
    testTwo: 'works as well!'
  }
  fs.writeFileSync(settingsPath, JSON.stringify(mockedSettings))

  settings = new ProjectSettings()
  const { testOne, testTwo } = settings.getAllSettings()
  t.is(testOne, 'works')
  t.is(testTwo, 'works as well!')
})

test('ProjectSettings#setSetting - sets new settings', t => {
  const mockedSettings = { testOne: 'works' }
  fs.writeFileSync(settingsPath, JSON.stringify(mockedSettings))

  settings = new ProjectSettings()
  t.is(settings.getSetting('testOne'), 'works')

  settings.setSetting('testOne', 'new setting')
  t.is(settings.getSetting('testOne'), 'new setting')
})

test('ProjectSettings#setAllSettings - takes a js object and overrides current settings', t => {
  const preWrittenSettings = { testOne: 'some information' }
  fs.writeFileSync(settingsPath, JSON.stringify(preWrittenSettings))

  const settings = new ProjectSettings()
  t.is(settings.getSetting('testOne'), 'some information')

  const overrideAll = {
    testOne: 'new information',
    anotherKey: 'with some value'
  }
  settings.setAllSettings(overrideAll)
  t.deepEqual(settings.getAllSettings(), overrideAll)
})

test('ProjectSettings#save - saves the current settings to the file', t => {
  const mockedSettings = { testOne: 'works' }
  fs.writeFileSync(settingsPath, JSON.stringify(mockedSettings))

  const settings = new ProjectSettings()
  settings.setSetting('testOne', 'new setting')
  settings.save()

  const newFile = fs.readFileSync(settingsPath, 'utf8')
  t.regex(newFile, /new setting/)
})


