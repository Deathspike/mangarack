import * as mio from '../';

// TODO: Move me.
export class Timer {
  private _creationTime: number;

  constructor() {
    this._creationTime = Date.now();
  }

  toString() {
    let elapsedTime = Date.now() - this._creationTime;
    let seconds = mio.format(Math.floor(elapsedTime / 1000) % 60, 2);
    let minutes = mio.format(Math.floor(elapsedTime / 1000 / 60) % 60, 2);
    let hours = mio.format(Math.floor(elapsedTime / 1000 / 60 / 60), 2);
    return `${hours}:${minutes}:${seconds}`;
  }
}
