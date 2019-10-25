/**
 * Provides set of properties describing {@link ReactElement} state.
 */
export interface ReactView<P = any, C = any> {
  /**
   * Properties of the element rendered by {@link React}.
   * This value may change depending on react lifecycle its used within.
   * Consumer should not care on own, injected, final props, that's why all of those are combined in one.
   * Field provide different props values, which includes:
   * - before rendering - component own props;
   * - while rendering - mixin of own props populated by injections, like props from store, dispatcher and other;
   * - after rendering - final properties being used by the rendered element.
   */
  readonly props: Readonly<P>;

  /** Context of the element rendered by {@link React}. */
  readonly context: Readonly<C>;
}
