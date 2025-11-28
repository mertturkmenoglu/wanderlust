export type ServiceIdentifier<T> = {
	key: symbol;
	_type?: T;
};

export type ServiceType<T extends ServiceIdentifier<unknown>> = NonNullable<
	T['_type']
>;

export class Container {
	private services = new Map<string, unknown>();

	provide<T>(t: ServiceIdentifier<T>, instance: T) {
		this.services.set(t.key.toString(), instance);
	}

	async provideAsync<T>(t: ServiceIdentifier<T>, instance: Promise<T>) {
		const res = await instance;
		this.services.set(t.key.toString(), res);
	}

	resolve<T>(t: ServiceIdentifier<T>): T {
		const instance = this.services.get(t.key.toString());

		if (!instance) {
			throw new Error(`No provider found for service: ${t.key.toString()}`);
		}

		return instance as T;
	}

	static createIdentifier<T>(s: string): ServiceIdentifier<T> {
		return {
			key: Symbol(s),
		};
	}
}

export type IServiceProvider<T> = {
	get(): T;
};
