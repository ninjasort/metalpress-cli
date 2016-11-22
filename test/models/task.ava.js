import Task from 'models/task'
import test from 'ava'

test('(Model) Task#run - throws if no run() is present', t => {
  const task = new Task({
    ui: '',
    settings: ''
  })

  t.throws(t => {
    task.run()
  }, /Tasks must implement run()/)
});