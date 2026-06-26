import consola from 'consola';

type PipelineOptions<T> = {
	values: T;
	enableMessages?: boolean;
};

export class Pipeline<T> {
	private steps: Array<{
		name: string;
		fn: (options: T) => Promise<void>;
	}> = [];

	private values: T;
	private enableMessages: boolean;

	constructor(options: PipelineOptions<T>) {
		this.values = options.values;
		this.enableMessages = options.enableMessages ?? true;
	}

	public addStep(name: string, fn: (options: T) => Promise<void>) {
		this.steps.push({ name, fn });
		return this;
	}

	public async run() {
		for (const { name, fn } of this.steps) {
			if (this.enableMessages) {
				consola.start(`Starting step: ${name}`);
			}

			await fn(this.values);

			if (this.enableMessages) {
				consola.success(`Completed step: ${name}`);
			}
		}
	}
}
