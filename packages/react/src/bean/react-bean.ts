import { BeanType } from "@mvcs/core";
import { InjectorComponent } from "./injector-component";

export namespace ReactBean {
  export interface Props {
    bean: BeanType | BeanType[];
  }
}

/**
 * Injects bean of particular type to the application context when mounted.
 */
export class ReactBean extends InjectorComponent<ReactBean.Props> {

  /** @inheritDoc */
  componentDidMount(): void {
    const {bean} = this.props;
    const injector = this.injector;

    if (Array.isArray(bean)) bean.forEach(injector.bean, injector);
    else injector.bean(bean);

  }

  /** @inheritDoc */
  componentWillUnmount(): void {
    // TODO: destroy beans?
  }
}
