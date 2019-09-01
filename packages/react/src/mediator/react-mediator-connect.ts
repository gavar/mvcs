import { closure } from "@emulsy/annotation";
import { Mediator, MediatorErrorHandlerObject } from "@mvcs/core";
import { Logger, logging } from "@mvcs/logger";
import { Component, ComponentType } from "react";
import { scheduleUpdate, shallowDiffers, Toggling } from "../util";
import { ModifiableView } from "../view";
import { MediatorConnect } from "./mediator-connect";
import { ReactViewMediator } from "./react-view-mediator";

/**
 * High-order component connecting mediators to a react component.
 */
@logging
export class ReactMediatorConnect<P = any> extends Component<P, Toggling> implements MediatorErrorHandlerObject {

  private finalProps: P;
  private readonly logger: Logger;
  private readonly type: ComponentType<P>;

  // by own
  private ownPropsDirty: boolean;

  // by view
  private view: ModifiableView<P>;
  private viewPropsDirty: boolean;

  // by mediator
  private mediators: Array<ReactViewMediator<P>>;
  private mediatorProps: Partial<P>;

  constructor(props: P, context: any, component: ComponentType<P>, mediators: Array<MediatorConnect<P>>) {
    super(props, context);

    this.type = component;
    this.view = new ModifiableView({
      commit: this.commitView,
    });
    this.view.update(props, context);

    if (mediators && mediators.length) {
      this.mediatorProps = {};
      this.mediators = MediatorConnect.create(mediators, this.view, this.mediatorProps, this);
    }
  }

  /** @inheritDoc */
  componentWillReceiveProps(props: Readonly<P>, context: any): void {
    Mediator.hookEach(this.mediators, "componentWillReceiveProps", this, props, context);
  }

  /** @inheritDoc */
  shouldComponentUpdate(props: Readonly<P>, state: Toggling, context: any): boolean {
    const {finalProps} = this;
    this.ownPropsDirty = this.ownPropsDirty || shallowDiffers(this.props, props);
    this.finalProps = this.recalculate(props);
    return shallowDiffers(finalProps, this.finalProps);
  }

  /** @inheritDoc */
  render() {
    this.view.updateBy(this);
    this.finalProps = this.recalculate(this.props);
    return this.view.render(this.type, this.finalProps, this.context);
  }

  /** @inheritDoc */
  componentWillUnmount(): void {
    // by mediator
    const {mediators} = this;
    if (mediators) {
      this.mediators = null;
      mediators.forEach(Mediator.destroyer, this);
    }
  }

  /** @inheritDoc */
  catchMediatorHookError(error: Error, hook: keyof any, mediator: Mediator) {
    this.logger.error("error while trying to invoke hook '", hook, "' on a mediator", mediator, error);
  }

  private recalculate(props: Readonly<P>): P {
    let {finalProps} = this;

    // should merge?
    if (this.ownPropsDirty || this.viewPropsDirty) {
      // merge props
      finalProps = {
        ...this.mediatorProps,
        ...props,
        ...this.view.state,
      };

      // reset flags
      this.ownPropsDirty = false;
      this.viewPropsDirty = false;
    }

    return finalProps;
  }

  @closure
  protected commitView() {
    this.viewPropsDirty = true;
    scheduleUpdate(this);
  }
}
