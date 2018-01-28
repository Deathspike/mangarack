import * as commander from 'commander';
import * as mio from './';
import * as fs from 'fs-extra';
import * as path from 'path';
import shared = mio.shared;
const packagePath = path.resolve(__dirname, '../../package.json');

export function parseAsync(argv: string[]) {
  return new Promise<void>(async (resolve, reject) => {
    let packageData = await fs.readJson(packagePath);
    commander.version(packageData.version);
    commander.option('--no-headless', 'disables headless mode');
    commander.command('create <url...>')
      .description('creates series metadata')
      .action(applyOptions.bind((urls: string[]) => mio.createAsync(urls).then(resolve, reject)));
    commander.command('download')
      .description('download series')
      .action(applyOptions.bind(() => mio.downloadAsync().then(resolve, reject)));
    commander.command('update <url...>')
      .description('updates series metadata')
      .action(applyOptions.bind((urls: string[]) => mio.updateAsync(urls).then(resolve, reject)));
    commander.parse(argv);
  });
}

function applyOptions(this: Function) {
  shared.settings.browserHeadless = (commander as any).headless;
  this.apply(undefined, arguments);
}
