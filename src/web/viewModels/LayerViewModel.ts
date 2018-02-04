import * as mobx from 'mobx';

export class LayerViewModel {
  @mobx.action
  create(component: React.Component) {
    this.layers.push(component);
  }

  @mobx.action
  close() {
    if (this.layers.length <= 1) return;
    this.layers.pop();
  }

  @mobx.observable
  public layers = [] as React.Component[];
}
