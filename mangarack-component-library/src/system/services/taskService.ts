/* TODO: Change `taskService` to object, instead of class, but somehow, that trips up TypeScript. Why? */
import * as mio from '../module';

export class taskService {
  static async enqueue<T>(priority: mio.PriorityType, task: () => Promise<T>): Promise<T> {
    throw new Error('TODO: Not implemented');
  }
};
