import { MediatorLifecycle } from "@mvcs/core";
import { ReactView } from "../view";

/**
 * Lifecycle hooks to allow updating mediator state when data being changed by high-order component.
 */
export interface ReactMediatorHooks<P = any, C = any> {
  /**
   * Set reference to a component instance.
   * @param instance - component instance.
   */
  setRef?(instance: any): void;

  /** @see DeprecatedLifecycle#componentWillMount. */
  componentWillMount?(): void;

  /** @see ComponentLifecycle#componentDidMount. */
  componentDidMount?(): void;

  /** @see ComponentLifecycle#componentWillReceiveProps. */
  componentWillReceiveProps?(props: Readonly<P>, context: C): void;

  /**
   * Called while rendering just before sending props to a view component.
   * Designed to be able to mutate final properties just before rendering.
   * @param props - final properties which will be sent to a view component.
   * @param context - context of the view component.
   */
  componentRender?(props: P, context?: C): void;

  /** @see ComponentLifecycle#componentDidUpdate. */
  componentDidUpdate?(prevProps: Readonly<P>): void;
}

/** Allows mediator to provide initial props which are injected into component properties. */
export interface MediatorProvideProps<T = never> {
  /** Get properties to merge with component properties before rendering. */
  getInitialProps?(): T;
}

/** Resolves type of properties provided by mediator to inject into view. */
export type MediatorProvidePropsType<T> = T extends {
  getInitialProps(): infer P;
} ? P : never;

/**
 * Provides hooks and properties which could be implemented by mediator.
 */
export interface ReactViewMediator<P = any, C = any> extends //
  MediatorLifecycle<ReactView<P>>,
  ReactMediatorHooks<P, C>,
  MediatorProvideProps {

}
