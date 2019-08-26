/**
 * Interface to be implemented by beans that need to react once all their properties have been set.
 */
export interface InitializingBean {

  /** Occurs after all bean properties have been supplied. */
  afterPropertiesSet(): void;
}

export namespace InitializingBean {
  /** Whether given object implements {@link InitializingBean}. */
  export function is(object: Partial<InitializingBean>): object is InitializingBean {
    return object && typeof object.afterPropertiesSet === "function";
  }
}
