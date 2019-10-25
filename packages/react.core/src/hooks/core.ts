import React, { Dispatcher } from "react";

const {
  ReactCurrentDispatcher,
} = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

/** Get current React dispatcher. */
export function useDispatcher(): Dispatcher {
  return ReactCurrentDispatcher.current;
}
