import Task from 'models/task';
import { expect } from 'chai';

describe('(Model) Task', () => {
  
  const task = new Task({
    ui: '',
    settings: ''
  });

  describe('#run', () => {
    it('throws if no run() is present', () => {
      expect(() => task.run()).to.throw(/Tasks must implement run()/);
    });
  });

});