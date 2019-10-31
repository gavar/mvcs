import React from "react";

declare module "react" {
  export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSecretInternals;
}

export interface ReactSecretInternals {
  ReactCurrentOwner: React.RefObject<unknown>;
  ReactCurrentDispatcher: React.RefObject<ReactDispatcher>;
  assign: typeof Object.assign
}

export interface ReactDispatcher {
  readContext<T>(context: React.Context<T>): T,
  useContext<T>(context: React.Context<T>): T,
}

export interface ReactElement extends React.ReactElement {
  $$typeof?: keyof any,
}
