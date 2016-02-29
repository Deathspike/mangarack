import * as mio from '../default';

/**
 * Represents a modal series component.
 */
export class ModalSeriesComponent extends mio.StatefulComponent<void, {text: string}> {
  /**
   * Occurs when the component is in the process of being mounted.
   */
  public componentWillMount(): void {
    super.componentWillMount();
    this.componentWillReceiveProps();
  }


  /**
   * Occurs when the component is receiving properties.
   */
  public componentWillReceiveProps() {
    this.setState({text: ''});
  }

  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div>
        <div className="modalContainerTitle">
          <span className="text">Add Series</span>
          <i className="fa fa-times-circle" onClick={() => mio.applicationActions.setModalType(mio.ModalType.None)} />
        </div>
        <div className="modalContainerBody">
          <label>Series Address:</label>
          <input autoFocus={true} type="text" value={this.state.text} onChange={(e: mio.InputFormEvent) => this._onChange(e.target.value)} />
          <button className="primary" disabled={!Boolean(this.state.text)} onClick={() => this._onClick()}>Add</button>
        </div>
      </div>
    );
  }

  /**
   * Occurs when the text changes.
   * @param text The text.
   */
  private _onChange(text: string): void {
    this.setState({text: text});
  }

  /**
   * Occurs when the button is clicked.
   */
  private _onClick(): void {
    /* TODO: implement this and explain how we want addresses (add label) and not searches ;-) */
    console.log(this.state.text);
  }
}
