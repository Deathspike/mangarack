export class Timer {
  private readonly _creationTime: number;

  constructor() {
    this._creationTime = Date.now();
  }

  toString() {
    let elapsedTime = Date.now() - this._creationTime;
    let seconds = String((Math.floor(elapsedTime / 1000) % 60, 2)).padStart(2, '0');
    let minutes = String((Math.floor(elapsedTime / 1000 / 60) % 60, 2)).padStart(2, '0');
    let hours = String((Math.floor(elapsedTime / 1000 / 60 / 60), 2)).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
