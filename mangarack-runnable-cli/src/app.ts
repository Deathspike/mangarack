import * as mio from './default';
import * as readline from 'readline';
let queue = Promise.resolve();

/*
 * Starts the process.
 */
(function(): void {
  let args = process.argv.splice(2);
  populateStore(args);
  if (args.every(x => !isValid(x))) {
    readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    }).on('line', (line: string) => {
      enqueue(line.replace(/\s+/, ' ').split(' '));
    });
  } else {
    enqueue(args);
  }
})();

/**
 * Promises to download the items.
 * @param items The items.
 * @return The promise to download the items.
 */
async function downloadAsync(items: string[]): Promise<void> {
  for (let item of items.filter(isValid)) {
    try {
      await mio.downloadService.seriesAsync(item);
    } catch (error) {
      console.error(error.stack || error);
    }
  }
}

/**
 * Enqueues the population and download of the items.
 * @param items The items.
 */
function enqueue(items: string[]): void {
  queue = queue.then(async () => {
    populateStore(items);
    await downloadAsync(items);
  });
}

/**
 * Determines if the item contains a series.
 * @param item The item.
 * @return Indicates if the item contains a series.
 */
function isValid(item: string): boolean {
  try {
    mio.openProvider(item);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Populates the store with items.
 * @param items The items.
 */
function populateStore(items: string[]): void {
  for (let i = 0; i < items.length - 1; i++) {
    let key = items[i];
    if (/^--/.test(key)) {
      mio.settingService.set(key.substr(2), items[i + 1]);
      i++;
    }
  }
}
