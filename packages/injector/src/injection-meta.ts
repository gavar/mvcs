import { BeanType } from "@mvcs/core";

/** Defines injection meta container. */
export interface InjectionMeta {
  injections: Record<string, PropertyInjection>;
}

/** Defines property injection options. */
export interface PropertyInjection<T = any> {
  type: BeanType<T>;
  lazy: boolean;
}

export namespace InjectionMeta {

  export const metaByType = new WeakMap<Function, InjectionMeta>();

  export function meta(type: Function): InjectionMeta {
    return metaByType.get(type);
  }

  export function getInjection(type: Function, key: string): PropertyInjection | void {
    for (; type; type = prototypeOf(type)) {
      const meta = metaByType.get(type);
      if (meta && meta.injections && meta.injections[key])
        return meta.injections[key];
    }
  }

  export function setInjection(type: Function, key: string, value: PropertyInjection): void {
    const meta = metaByType.get(type) || {} as InjectionMeta;
    const injections = meta.injections || {};
    injections[key] = value;
    meta.injections = injections;
    metaByType.set(type, meta);
  }

  function prototypeOf(type: Function): Function {
    if (type) type = Object.getPrototypeOf(type);
    switch (type) {
      case Function.prototype:
      case Object.prototype:
        return null;
      default:
        return type;
    }
  }
}
