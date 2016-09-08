import commander from 'commander';
import Install from '../sub-commands/install';

const subCommand = new Install({ uninstall: true });

commander.on('--help', () => {
  subCommand.printUserHelp();
});

commander
  .arguments('<theme name>')
  .action((theme, command) => {
    if (typeof theme === 'undefined') {
      console.error('Did not specify theme.');
      process.exit(1);
      return false;
    }
    subCommand.run({
      theme
    });
  });

commander.parse(process.argv);