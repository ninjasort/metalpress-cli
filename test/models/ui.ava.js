import sinon from 'sinon'
import chalk from 'chalk'
import test from 'ava'
import MockUI from '../helpers/mock-ui'
import { EOL } from 'os'

const ui = new MockUI('DEBUG')

test.beforeEach(t => {
  ui.clear()
})

test('(Model) UI#write - (when an error) - writes an errorStream if its an ERROR', t => {
  ui.write('some text', 'ERROR');
  t.is(ui.errors, 'some text')
  t.is(ui.output, '')
})

test('UI#writeLine - appends EOL to text being written', t => {
  ui.writeLine('this is a line')
  const expectedString = 'this is a line' + EOL
  t.is(ui.output, expectedString)
})

let string

test.beforeEach(t => {
  string = 'file was made here'
})

test('UI#writeCreate - prepends a green "create"', t => {
  ui.writeCreate(string)
  const expected = chalk.green('  create: ') + chalk.white(string)
  t.is(ui.output, expected + EOL)
})

test('UI#writeCreate - prepends a blue "info"', t => {
  ui.writeInfo(string)
  const expected = chalk.blue('  info: ') + chalk.white(string)
  t.is(ui.output, expected + EOL)
})

test('#writeDebug - prepends a gray "debug"', t => {
  ui.writeDebug(string)
  const expected = chalk.gray('  debug: ') + chalk.white(string)
  t.is(ui.output, expected + EOL)
})

test('#writeError - prepends a red "error"', t => {
  ui.writeError(string)
  const expected = chalk.red('  error: ') + chalk.white(string)
  t.is(ui.errors, expected + EOL)
})

test('#writeWarning - prepends a yellow "warning"', t => {
  ui.writeWarning(string)
  const expected = chalk.yellow('  warning: ') + chalk.white(string)
  t.is(ui.output, expected + EOL)
});

test('#writeCreate - prepends a green "create"', t => {
  ui.writeCreate(string)
  const expected = chalk.green('  create: ') + chalk.white(string)
  t.is(ui.output, expected + EOL)
})

test('#writeWouldCreate - prepends a green "warning"', t => {
  ui.writeWouldCreate(string)
  const expected = chalk.green('  would create: ') + chalk.white(string)
  t.is(ui.output, expected + EOL)
})

test('#writeLevelVisible - can only see ERROR messages', t => {
  const ui = new MockUI('ERROR')
  t.is(ui.writeLevelVisible('ERROR'), true)
  t.is(ui.writeLevelVisible('WARNING'), false)
  t.is(ui.writeLevelVisible('INFO'), false)
  t.is(ui.writeLevelVisible('DEBUG'), false)
})

test('#writeLevelVisible - can only see ERROR & WARNING messages', t => {
  const ui = new MockUI('WARNING')
  t.is(ui.writeLevelVisible('ERROR'), true)
  t.is(ui.writeLevelVisible('WARNING'), true)
  t.is(ui.writeLevelVisible('INFO'), false)
  t.is(ui.writeLevelVisible('DEBUG'), false)
})

test('#writeLevelVisible - only see ERROR/WARNING/INFO message', t => {
  const ui = new MockUI('INFO')
  t.is(ui.writeLevelVisible('ERROR'), true)
  t.is(ui.writeLevelVisible('WARNING'), true)
  t.is(ui.writeLevelVisible('INFO'), true)
  t.is(ui.writeLevelVisible('DEBUG'), false)
})

test('#writeLevelVisible - when set to DEBUG has complete visibility', t => {
  const ui = new MockUI('DEBUG')
  t.is(ui.writeLevelVisible('DEBUG'), true)
  t.is(ui.writeLevelVisible('INFO'), true)
  t.is(ui.writeLevelVisible('WARNING'), true)
  t.is(ui.writeLevelVisible('ERROR'), true)
})

test('#setWriteLevel - can reset writeLevel', t => {
  t.is(ui.writeLevel, 'DEBUG')
  ui.setWriteLevel('ERROR')
  t.is(ui.writeLevel, 'ERROR')
})

test('#setWriteLevel - throws when a bad writeLevel is passed in', t => {
  const error = t.throws(() => {
    ui.setWriteLevel('bogus')
  }, Error)
  t.regex(error.message, /Valid values are: DEBUG, INFO, WARNING, ERROR/)
})

test('#startProgress - starts streaming', t => {
  t.is(ui.streaming, false)
  ui.startProgress('some async call')
  t.is(ui.streaming, true)
})

test('calls stream every 100 ms', t => {
  const clock = sinon.useFakeTimers()
  const spy = sinon.spy()
  ui.startProgress('some async call', spy)
  clock.tick(101)
  t.is(spy.calledOnce, true)
  clock.restore()
})

test('#stopProgress - clears interval when it exists', t => {
  ui.startProgress('some async call')
  t.is(ui.streaming, true)
  ui.stopProgress()
  t.is(ui.streaming, false)
})
