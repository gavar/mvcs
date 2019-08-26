import { EventEmitter } from "@mvcs/event";
import { Injector } from "@mvcs/injector";

/**
 * Context is a scope of dependencies.
 * Context is core to any application or module.
 */
export interface Context extends EventEmitter {

  /** Context dependency injector. */
  readonly injector: Injector;

  /** Whether this context is initialized. */
  readonly initialized: boolean;

  /** Initialize this context. */
  initialize(): void;

  /** Destroy this context. */
  destroy(): void;
}
