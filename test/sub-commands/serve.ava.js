import path from 'path'
import Serve from 'sub-commands/serve'
import sinon from 'sinon'
import pmock from 'pmock'
import test from 'ava'

let cwd, subCommand

test.before(t => {
  cwd = pmock.cwd(path.resolve(__dirname, '../fixtures/standard'))
  subCommand = new Serve()
})

test.cb('should call back without error', t => {
  subCommand.build((err) => {
    t.falsy(err)
    t.end()
  })
})