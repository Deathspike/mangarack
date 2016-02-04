'use strict';
import * as mio from './default';
import * as readline from 'readline';
let storeService = mio.dependency.get<mio.IStoreService>('IStoreService');
let queue = Promise.resolve();

/*
 * Starts the process.
 */
(function() {
  let args = process.argv.splice(2);
  populateStore(args);
  if (hasAnySeries(args)) {
    enqueue(args);
  } else {
    readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    }).on('line', (line: string) => {
      enqueue(line.replace(/\s+/, ' ').split(' '));
    });
  }
})();

/**
 * Kills the process.
 * @param The error.
 */
function die(err: any): void {
  console.log(err.stack || err);
  process.exit(1);
}

/**
 * Promises to download the items.
 * @param items The items.
 * @return The promise to download the items.
 */
async function downloadAsync(items: string[]): Promise<void> {
  for (let item of items) {
    try {
      mio.openProvider(item);
    } catch (e) {
      continue;
    }
    await mio.download.seriesAsync(item);
  }
}

/**
 * Enqueues the population and download of the items.
 * @param items The items.
 */
function enqueue(items: string[]): void {
  queue = queue.then(async () => {
    try {
      populateStore(items);
      await downloadAsync(items);
    } catch (e) {
      die(e);
    }
  });
}

/**
 * Determines if the collection of items contain a series.
 * @param items The items.
 * @return Indicates if the collection of items contain a series.
 */
function hasAnySeries(items: string[]): boolean {
  for (let item of items) {
    try {
      mio.openProvider(item);
      return true;
    } catch (e) {
      continue;
    }
  }
  return false;
}


/**
 * Populates the store with items.
 * @param items The items.
 */
function populateStore(items: string[]): void {
  for (let i = 0; i < items.length - 1; i++) {
    let key = items[i];
    if (/^--/.test(key) && !/^--disable/.test(key)) {
      storeService().set(key.substr(2), items[i + 1]);
      i++;
    }
  }
}
