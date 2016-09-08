import commander from 'commander';
// import version from '../../package';

const program = commander;

// program
//   .version()

program
  .command('init', 'initialize a metalpress.config.js file');

program
  .command('new', 'creates a new metalpress project');

program
  .command('serve', 'start a server on http://localhost:3000');

program
  .command('install <name>', 'install new themes').alias('i');

program
  .command('uninstall <name>', 'uninstall new themes');

program
  .command('deploy', 'deploy a metalpress project');

program.parse(process.argv);