import consola from 'consola';

type StepOptions<TContext, TResult> = {
	name: string;
	skip?: boolean;
	fn: (context: TContext) => Promise<TResult>;
};

type Merge<TContext, TResult> = TResult extends void
	? TContext
	: Omit<TContext, keyof TResult> & TResult;

export class Pipeline<TContext extends object> {
	// biome-ignore lint/suspicious/noExplicitAny: This is a generic pipeline, so we need to allow any type for the steps.
	private steps: Array<StepOptions<any, any>> = [];

	private context: TContext;
	private enableMessages: boolean;

	constructor(options: { values: TContext; enableMessages?: boolean }) {
		this.context = options.values;
		this.enableMessages = options.enableMessages ?? true;
	}

	public addStep<TResult = void>(
		step: StepOptions<TContext, TResult>,
	): Pipeline<Merge<TContext, TResult>> {
		this.steps.push(step);
		return this as unknown as Pipeline<Merge<TContext, TResult>>;
	}

	public async run(): Promise<TContext> {
		for (const step of this.steps) {
			if (this.enableMessages) {
				consola.start(`Step: ${step.name}`);
			}

			if (step.skip) {
				if (this.enableMessages) {
					consola.info(`Skipping step: ${step.name}`);
				}
				continue;
			}

			const result = await step.fn(this.context);

			if (result && typeof result === 'object') {
				this.context = { ...this.context, ...result };
			}
		}

		return this.context;
	}
}
