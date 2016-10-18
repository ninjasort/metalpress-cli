import Task from '../models/task';
import denodeify from 'denodeify';

// const exec = denodeify(require('child_process').exec);
const exec = require('child_process').exec;

export default class extends Task {
  constructor(environment) {
    super(environment);
  }

  run(gitUrl, command) {
    const ui = this.ui;
    const start = command.start.replace('{URL}', `${gitUrl}`);
    
    ui.startProgress(`${start}`);
    
    return new Promise((resolve, reject) => {
      exec(`npm ${command.name} ${gitUrl} ${command.options ? command.options : ''}`, (err, stdout, stderr) => {
        ui.stopProgress();
        
        if (stderr) {
          ui.writeError('Something went wrong... please try again.  Make sure you have internet access');
          ui.writeError(`Error code: ${err}`);
          process.exit(1);
        }
        
        ui.writeInfo(`${command.stop}`);
        resolve(stdout);
      });
    });
  }
}