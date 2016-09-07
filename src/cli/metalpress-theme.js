import commander from 'commander';
import Theme from '../sub-commands/theme';

const subCommand = new Theme();

commander.on('--help', () => {
  subCommand.printUserHelp();
});

subCommand.run();