import * as commander from 'commander';
import * as mio from './';
import * as fs from 'fs-extra';
import * as path from 'path';
const packagePath = path.resolve(__dirname, '../../package.json');

export async function execAsync(argv: string[]) {
  let packageData = await fs.readJson(packagePath);
  commander.version(packageData.version);
  commander.option('--no-webpack', 'disables webpack middleware');
  commander.option('-p, --port <n>', 'sets the port', parseInt);
  commander.parse(argv);
  await mio.serveAsync(commander.port || mio.settings.serverPort, commander.webpack);
}
