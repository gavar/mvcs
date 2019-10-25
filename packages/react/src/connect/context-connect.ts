import { Context, useContext } from "react";

/** Function binding {@link Context} values to components properties. */
export interface ContextToProps<C, P, K extends keyof P> {
  /**
   * Resolve properties to merge with component properties.
   * @param context - context values.
   * @param own - component own properties.
   * @returns properties for component rendering.
   */
  (context: C, own: Readonly<P>): Pick<P, K>;
}

/** Defines connection between context and view props via {@link ContextToProps}. */
export interface ContextConnect<P, K extends keyof P = any, C = any> {
  /**
   * Type of the context to use.
   * Leave empty to use {@link ChildContextProvider legacy context provider}.
   */
  contextType?: Context<C>;

  /** Function binding context properties to components properties. */
  contextToProps: ContextToProps<C, P, K>;
}

export namespace ContextConnect {
  /**
   * Reduce context connectors to a single object.
   * @param own - component own properties.
   * @param legacyContext - legacy context to use when {@link ContextConnect#contextType} is not defined.
   * @param items - array of context connectors.
   * @param out - buffer to fill with property values.
   */
  export function reduce<P>(
    own: Readonly<P>,
    legacyContext: any,
    items: Array<ContextConnect<P>>,
    out?: Partial<P>): Partial<P> {
    for (const item of items) {
      const context = item.contextType ? useContext(item.contextType) : legacyContext;
      const props = item.contextToProps(context, own);
      out = out ? Object.assign(out, props) : props as Partial<P>;
    }
    return out;
  }
}
