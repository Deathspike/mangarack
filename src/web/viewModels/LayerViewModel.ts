import * as mobx from 'mobx';
let layers: LayerViewModel | undefined;

export class LayerViewModel {
  private constructor() {
    this.layers = [];
  }

  @mobx.action
  close() {
    if (this.layers.length <= 1) return;
    this.layers.pop();
  }

  @mobx.action
  open(component: JSX.Element) {
    this.layers.push(component);
  }

  @mobx.observable
  layers: JSX.Element[];

  public static get() {
    return layers || (layers = new LayerViewModel());
  }
}
