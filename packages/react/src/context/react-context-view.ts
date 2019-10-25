import { Context, DefaultContext } from "@mvcs/context";
import { Component, createElement } from "react";
import { Newable } from "tstt";
import { ReactContext } from "./react-context";

export declare namespace ReactContextView {
  export interface Props<T extends Context = Context> {
    /** Type of the context to create on component mount. */
    contextType?: Newable<T>;

    /**
     * Function configuring context for the application needs.
     * @param context - context created by {@link }
     */
    configure?(context: T): void;
  }
}

/**
 * React component initializing `mvcs` context.
 */
export class ReactContextView<T extends Context = Context> extends Component<ReactContextView.Props<T>> {

  static defaultProps: Partial<ReactContextView.Props> = {
    contextType: DefaultContext,
  };

  protected mvcs: T;

  constructor(props: ReactContextView.Props<T>, context: any) {
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
    return createElement(
      ReactContext.Provider,
      {value: this.mvcs},
      this.props.children,
    );
  }
}
