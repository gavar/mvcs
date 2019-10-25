import { Component } from "react";

/**
 * Schedule component re-rendering by toggling it's state property.
 * As oppose to {@link Component#forceUpdate}, provides possibility to schedule re-rendering preserving natural
 * lifecycle. Multiple subsequent calls will result in calling {@link Component#setState} with same values, so
 * component will be re-rendered only once.
 * @param view - component whose state should be altered in order for triggering repaint.
 */
export function scheduleUpdate<P, S extends Toggling>(view: Component<P, S>) {
  const {_toggler} = view.state || ZERO;
  view.setState(_toggler === 0 ? ONE : ZERO);
}

/**
 * Represents an object state with toggling value required in order to trigger component re-rendering.
 */
export interface Toggling {
  /** Numeric value triggering component updates. */
  _toggler?: 0 | 1;
}

const ZERO: Toggling = {_toggler: 0};
const ONE: Toggling = {_toggler: 1};
