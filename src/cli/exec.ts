import * as commander from 'commander';
import * as mio from './';
import * as fs from 'fs-extra';
import * as path from 'path';
import shared = mio.shared;
const packagePath = path.resolve(__dirname, '../../package.json');

export function execAsync(argv: string[]) {
  return new Promise<void>(async (resolve, reject) => {
    let packageData = await fs.readJson(packagePath);
    commander.version(packageData.version);
    commander.option('--no-headless', 'disables headless mode');
    commander.command('create <url...>')
      .description('creates series metadata')
      .action(exec<string[]>(urls => mio.commands.createAsync(urls).then(resolve, reject)));
    commander.command('download')
      .description('download series')
      .action(exec(() => mio.commands.downloadAsync().then(resolve, reject)));
    commander.command('update <url...>')
      .description('updates series metadata')
      .action(exec<string[]>(urls => mio.commands.updateAsync(urls).then(resolve, reject)));
    commander.parse(argv);
  });
}

function exec<T>(callback: (args: T) => void) {
  return function() {
    shared.settings.browserHeadless = commander.headless;
    callback.apply(undefined, arguments);
  };
}
