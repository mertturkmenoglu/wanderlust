export type ServiceIdentifier<T> = {
  key: symbol;
  _type?: T;
};

export type ServiceType<T extends ServiceIdentifier<unknown>> = NonNullable<
  T["_type"]
>;

export class Container {
  private services = new Map<symbol, unknown>();

  provide<T>(t: ServiceIdentifier<T>, instance: T) {
    this.services.set(t.key, instance);
  }

  async provideAsync<T>(t: ServiceIdentifier<T>, instance: Promise<T>) {
    this.services.set(t.key, await instance);
  }

  resolve<T>(t: ServiceIdentifier<T>): T {
    const instance = this.services.get(t.key);

    if (!instance) {
      throw new Error(`No provider found for service: ${t.key.toString()}`);
    }

    return instance as T;
  }

  static createIdentifier<T>(): ServiceIdentifier<T> {
    return {
      key: Symbol(),
    };
  }
}

export interface IServiceProvider<T> {
  createInstance(ioc: Container): T | Promise<T>;
}
