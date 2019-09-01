import { Transceiver } from "@mvcs/base";
import { Mutable } from "tstt";
import { Mutation } from "../mutation";
import { ReactModifiableView } from "../view";
import { ReactViewMediator } from "./react-view-mediator";

/** React component mediation layer. */
export class ReactMediator<P = any, C = any> extends Transceiver implements ReactViewMediator<P> {

  /** Reference to a view component instance.  */
  readonly ref: any;

  /** React view mediated by this instance. */
  readonly view: ReactModifiableView<P, C>;

  /** @inheritDoc */
  setView(this: Mutable<ReactMediator>, view: ReactModifiableView<P, C>): void {
    this.view = view;
  }

  /** @inheritDoc */
  setRef(this: Mutable<ReactMediator>, instance: any) {
    this.ref = instance;
  }

  /** @inheritDoc */
  destroy() {
    // using 'postDestroy', leaving this for application-specific logic
  }

  /** @inheritDoc */
  postDestroy(): void {
    super.destroy();
  }

  /** Alias for calling {@link ReactModifiableView#commitBy} using this mediator as this instance. */
  protected commitMy<T extends any[]>(mutation: Mutation<Partial<P>, T, this>, ...args: T): void {
    return this.view.commitBy(this, mutation, ...args);
  }

  /**
   * Schedule view to repaint next frame.
   * @deprecated - avoid using this.
   */
  protected scheduleUpdate() {
    this.view.commit(() => true);
  }
}
