import React from "react";

declare module "react" {
  const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals;

  interface Dispatcher {
    readContext<T>(context: React.Context<T>): T,
    useContext<T>(context: React.Context<T>): T,
  }

  interface ReactSharedInternals {
    ReactCurrentOwner: React.RefObject<unknown>;
    ReactCurrentDispatcher: React.RefObject<Dispatcher>;
    assign: typeof Object.assign
  }

  interface ReactElement {
    $$typeof: keyof any,
  }
}
