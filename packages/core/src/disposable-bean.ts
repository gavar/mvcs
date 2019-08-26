/**
 * Interface to be implemented by beans that want to release resources upon destruction.
 */
export interface DisposableBean {
  /** Occurs on object destruction. */
  destroy(): void;
}

/** Whether given object implements {@link InitializingBean}. */
export function isDisposableBean(object: Partial<DisposableBean>): object is DisposableBean {
  return object &&
    typeof object.destroy === "function";
}

/**
 * Function to pass as iterative callback in order to destroy bean.
 * @param bean - bean to destroy.
 */
export function beanDestroyer(this: BeanDestroyErrorHandler, bean: DisposableBean) {
  try {
    bean.destroy();
  } catch (e) {
    (this || defaultErrorHandler).catchBeanDestroyError(e, bean);
  }
}

export interface BeanDestroyErrorHandler {
  /**
   * Function to invoke for catching errors while invoking bean destructor.
   * @param error - error occurred while destroying a bean.
   * @param bean - bean instance throwing an error.
   * @see DisposableBean#destroy
   */
  catchBeanDestroyError(error: Error, bean: any): void;
}

const defaultErrorHandler: BeanDestroyErrorHandler = {
  /** @inheritDoc */
  catchBeanDestroyError(error: Error, bean: any) {
    console.error("error while trying to destroy bean", bean, error);
  },
};
