import * as mio from '../';
import shared = mio.shared;

export class Timer {
  private _creationTime: number;

  constructor() {
    this._creationTime = Date.now();
  }

  toString() {
    let elapsedTime = Date.now() - this._creationTime;
    let seconds = shared.format(Math.floor(elapsedTime / 1000) % 60, 2);
    let minutes = shared.format(Math.floor(elapsedTime / 1000 / 60) % 60, 2);
    let hours = shared.format(Math.floor(elapsedTime / 1000 / 60 / 60), 2);
    return `${hours}:${minutes}:${seconds}`;
  }
}
