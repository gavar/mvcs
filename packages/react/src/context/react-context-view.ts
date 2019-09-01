import { Context } from "@mvcs/context";
import { Component, createElement } from "react";
import { ReactContext } from "./react-context";

export namespace ReactContextView {
  export interface Props {
    contextType: new () => Context;
    configure?(context: Context): void;
  }
}

/**
 * React component initializing `mvcs` context.
 */
export class ReactContextView extends Component<ReactContextView.Props> {
  protected mvcs: Context;

  constructor(props: ReactContextView.Props, context: any) {
    super(props, context);
    const {contextType, configure} = props;

    // configure context
    this.mvcs = new contextType();
    if (configure) configure(this.mvcs);
    this.mvcs.initialize();
  }

  /** @inheritDoc */
  componentDidMount(): void {
    this.mvcs.initialize();
  }

  /** @inheritDoc */
  componentWillUnmount(): void {
    this.mvcs.destroy();
    this.mvcs = null;
  }

  /** @inheritDoc */
  render() {
    return createElement(ReactContext.Provider,
      {value: this.mvcs},
      this.props.children,
    );
  }
}
