import * as os from 'os';
import * as path from 'path';
import * as sanitizeFilename from 'sanitize-filename';
const basePath = [os.homedir(), 'mangarack'];

export function hidden(...args: string[]): string {
  return path.resolve.apply(path, basePath.concat('.mrprivate').concat(sanitize(args)));
}

export function normal(...args: string[]): string {
  return path.resolve.apply(path, basePath.concat(sanitize(args)));
}

function sanitize(args: string[]) {
  return args.map(arg => sanitizeFilename(arg));
}
