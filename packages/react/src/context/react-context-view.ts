import { Context, DefaultContext } from "@mvcs/context";
import { Component } from "react";

export interface ReactMvcsContext {
  mvcs: ReactContextViewContent;
}

export interface ReactContextViewContent {
  context: Context;
}

export interface ReactContextViewProps {
  contextType?: new () => Context;
  configure?(context: Context): void;
}

/**
 * React component initializing an MVCS context.
 */
export class ReactContextView extends Component<ReactContextViewProps> {

  protected viewContext: Context;
  protected childContext: ReactMvcsContext;
  protected mvcsContext: ReactContextViewContent;

  public static readonly defaultProps: ReactContextViewProps = {
    contextType: DefaultContext,
  };

  constructor(props: ReactContextViewProps, context: any) {
    super(props, context);
    const {contextType, configure} = props;

    // configure context
    this.viewContext = new contextType();
    if (configure) configure(this.viewContext);
    this.viewContext.initialize();

    // initialize react context
    this.mvcsContext = {context: this.viewContext};
    this.componentWillUpdate(props, this.state, context);
  }

  /** @inheritDoc */
  getChildContext(): ReactMvcsContext {
    return this.childContext;
  }

  /** @inheritDoc */
  componentWillUpdate(props: Readonly<ReactContextViewProps>, state: Readonly<{}>, context: any): void {
    // child context
    this.childContext = {
      ...context,
      mvcs: this.mvcsContext,
    };
  }

  /** @inheritDoc */
  componentDidMount(): void {
    this.viewContext.initialize();
  }

  /** @inheritDoc */
  componentWillUnmount(): void {
    this.viewContext.destroy();
    this.viewContext = null;
  }

  /** @inheritDoc */
  render() {
    return this.props.children;
  }
}
