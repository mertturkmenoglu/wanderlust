import consola from 'consola';

type PipelineOptions<T> = {
	values: T;
	enableMessages?: boolean;
};

type StepOptions<TPipelineOptions> = {
	name: string;
	skip?: boolean;
	fn: (options: TPipelineOptions) => Promise<void>;
};

export class Pipeline<T> {
	private steps: Array<StepOptions<T>> = [];

	private values: T;
	private enableMessages: boolean;

	constructor(options: PipelineOptions<T>) {
		this.values = options.values;
		this.enableMessages = options.enableMessages ?? true;
	}

	public addStep(step: StepOptions<T>) {
		this.steps.push(step);
		return this;
	}

	public async run() {
		for (const step of this.steps) {
			if (this.enableMessages) {
				consola.start(`Starting step: ${step.name}`);
			}

			if (step.skip) {
				if (this.enableMessages) {
					consola.info(`Skipping step: ${step.name}`);
				}

				continue;
			}

			await step.fn(this.values);

			if (this.enableMessages) {
				consola.success(`Completed step: ${step.name}`);
			}
		}
	}
}
