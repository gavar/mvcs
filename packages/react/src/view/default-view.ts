import { Component, ComponentType, createElement, ReactElement } from "react";
import { ReactView } from "./react-view";

/**
 * Default implementation of {@link ReactView}.
 */
export class DefaultView<P, C = any> implements ReactView<P, C> {

  /** Rendered element. */
  el: ReactElement<P>;

  /** @inheritDoc */
  props: Readonly<P>;

  /** @inheritDoc */
  context: Readonly<C>;

  /**
   * Update view properties.
   * @param props - properties to set for {@link props}.
   * @param context - context to set for {@link context}.
   */
  update(props: Readonly<P>, context: Readonly<C>) {
    this.props = props;
    this.context = context;
  }

  /**
   * Update view properties by taking values of the provided component.
   * @param component - component whose properties to copy over.
   */
  updateBy(component: Component<P>) {
    this.props = component.props;
    this.context = component.context;
  }

  /**
   * Update view with latest properties and render component of the provided type.
   * @param type - component to render.
   * @param props - props to pass into component.
   * @param context - context being used to render component.
   * @return rendered component instance.
   */
  render(type: ComponentType<P>, props: Readonly<P>, context: Readonly<C>) {
    this.update(props, context);
    this.el = createElement(type, this.props);
    this.props = this.el.props;
    return this.el;
  }
}
