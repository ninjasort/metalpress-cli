import SubCommand from 'models/sub-command';
import test from 'ava'

let command

test.beforeEach(t => {
  command = new SubCommand()
})

test('subclass overrides interface', t => {
  const error = t.throws(() => {
    command.run()
  }, Error)
  t.is(error.message, 'Subcommands must implement a run()')
})

test('throws if subclass doesnt have availableOptions()', t => {
  const error = t.throws(() => {
    command.availableOptions()
  }, Error)
  t.is(error.message, 'Subcommands must implement a availableOptions()')
})