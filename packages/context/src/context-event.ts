export namespace ContextEvent {
  /** Event notifying context is being initialized. */
  export const INITIALIZING = "mvcs.context.initializing";

  /** Event notifying context has benn initialized. */
  export const INITIALIZED = "mvcs.context.initialized";

  /** Event indicating that the context is ready to serve user requests. */
  export const READY = "mvcs.context.ready";
}
