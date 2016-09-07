import SubCommand from '../models/sub-command';

export default class Theme extends SubCommand {
  constructor() {
    super();
  }

  run() {
    console.log('installing theme...');
  }
}