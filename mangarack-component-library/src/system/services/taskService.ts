import * as mio from '../module';
const queue: {[priorityType: number]: {reject: (reason: any) => void, resolve: (value: any) => void, runAsync: () => Promise<any>}[]} = {};
let isBusy = false;

/**
 * Represents the task service.
 * @internal
 */
export let taskService = {
  /**
   * Promises to run the task with the assigned priority.
   * @param priorityType The priority type.
   * @param runAsync The task runner.
   * @return The promise to run the task with the assigned priority.
   */
  enqueue: async function<T>(priorityType: mio.PriorityType, runAsync: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!queue[priorityType]) {
        queue[priorityType] = [{reject: reject, resolve: resolve, runAsync: runAsync}];
      } else {
        queue[priorityType].push({reject: reject, resolve: resolve, runAsync: runAsync});
      }
      tryRun();
    });
  }
};

/**
 * Completes the task.
 */
function completeTask(): void {
  isBusy = false;
  tryRun();
}

/**
 * Tries to run a task from the queue.
 */
function tryRun(): void {
  tryRunWithPriority(mio.PriorityType.High);
  tryRunWithPriority(mio.PriorityType.Normal);
  tryRunWithPriority(mio.PriorityType.Low);
}

/**
 * Tries to run a task from the queue with a priority.
 * @param priorityType The priority type.
 */
function tryRunWithPriority(priorityType: mio.PriorityType): void {
  if (!isBusy && queue[priorityType] && queue[priorityType].length > 0) {
    let entry = queue[priorityType].shift();
    if (entry) {
      isBusy = true;
      entry.runAsync().then(value => {
        entry!.resolve(value);
        completeTask();
      }, reason => {
        entry!.reject(reason);
        completeTask();
      });
    }
  }
}
