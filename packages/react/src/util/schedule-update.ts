import { Component } from "react";

/**
 * Schedule component re-rendering by toggling it's state property.
 * As oppose to {@link Component#forceUpdate}, provides possibility to schedule re-rendering preserving natural lifecycle.
 * Multiple subsequent calls will result in calling {@link Component#setState} with same so component will be re-rendered only once.
 * @param component - component whose state should be altered in order for triggering repaint.
 */
export function scheduleUpdate<P, S extends Toggling>(component: Component<P, S>) {
  component.setState(component.state && component.state._toggler === 0 ? ONE : ZERO);
}

/**
 * Represents the object with toggling value in order to trigger component re-rendering.
 */
export interface Toggling {
  /** Numeric value triggering component updates. */
  _toggler?: 0 | 1;
}

const ZERO: Toggling = {_toggler: 0};
const ONE: Toggling = {_toggler: 1};
