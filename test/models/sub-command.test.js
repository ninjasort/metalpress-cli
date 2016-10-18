import { expect } from 'chai';
import SubCommand from 'models/sub-command';

describe('(Model) SubCommand', () => {
  const command = new SubCommand();

  describe('subclass overrides interface', () => {
    it('throws if subclass doesnt have run()', () => {
      expect(() => command.run()).to.throw(/Subcommands must implement a run()/);
    });

    it('throws if subclass doesnt have availableOptions()', () => {
      expect(() => command.availableOptions()).to.throw(
          /Subcommands must implement a availableOptions()/
        );
    });
  });

});