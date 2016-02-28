import * as mio from '../../default';

/**
 * Represents an input form event.
 */
export interface InputFormEvent extends React.FormEvent {
  /**
   * Contains the target.
   */
  target: mio.InputEventTarget;
}
