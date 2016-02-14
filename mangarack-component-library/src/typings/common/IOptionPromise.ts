import * as mio from '../../default';

/**
 * Represents the completion of an asynchronous operation with an option value result.
 */
export interface IOptionPromise<T> extends Promise<mio.IOption<T>> {}
