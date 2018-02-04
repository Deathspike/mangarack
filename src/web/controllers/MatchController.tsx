import * as React from 'react';

export abstract class MatchController<TParams extends {[key: string]: string}, TViewModel> extends React.Component<{match: {params: TParams}}, {vm?: TViewModel}> {
  abstract createAsync(params: TParams): Promise<TViewModel>;

  constructor(props: {match: {params: TParams}}, context?: any) {
    super(props, context)
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props: {match: {params: TParams}}) {
    let params = this._decodeParams(props.match.params);
    this.setState({});
    this.createAsync(params).then(vm => this.setState({vm}));
  }

  refresh() {
    let params = this._decodeParams(this.props.match.params);
    this.setState({vm: undefined});
    this.createAsync(params).then(vm => this.setState({vm}));
  }

  private _decodeParams(params: TParams) {
    let result = {} as TParams;
    Object.keys(params).forEach(key => result[key] = decodeURIComponent(params[key]));
    return result;
  }
}
