import { Queue, type QueueOptions, Worker, type WorkerOptions } from 'bullmq';
import type { z } from 'zod';

/**
 * IFF Queue and Worker builder options.
 */
type DefineQueueOptions<S extends z.core.$ZodShape, T = unknown> = {
	/** Name of the queue */
	name: string;
	/** Zod schemas for the queue's events and payloads */
	schemas: z.ZodObject<S>;
	/** Processors for handling the queue's events */
	processors: {
		[K in keyof S]: (data: z.infer<S[K]>, context: T) => Promise<void> | void;
	};
	/** Options for configuring the queue */
	queueOptions?: QueueOptions;
	/** Options for configuring the worker */
	workerOptions?: WorkerOptions;
};

/**
 * Defines a queue with its name, schemas, processors, and options.
 *
 * **Call the build() method to create the queue and worker.**
 *
 * @param context - The context to be passed to the processors.
 * @param def - The definition of the queue, including its name, schemas, processors, and options.
 * @returns An object containing the queue's name, schemas, processors, options, and a build function to create the queue and worker.
 */
export function defineQueue<S extends z.core.$ZodShape, T = unknown>(
	context: T,
	def: DefineQueueOptions<S, T>,
) {
	type Payloads = z.infer<z.ZodObject<S>>;
	type EventName = keyof Payloads & string;
	type Data = Payloads[EventName];

	return {
		name: def.name,
		schemas: def.schemas,
		processors: Object.fromEntries(
			Object.entries(def.processors).map(([key, p]) => [
				key,
				(data: z.infer<S[keyof S]>) => p(data, context),
			]),
		) as { [K in keyof S]: (data: z.infer<S[K]>) => Promise<void> | void },
		queueOptions: def.queueOptions,
		workerOptions: def.workerOptions,
		build: () => {
			const queue = new Queue<Data, unknown, EventName>(
				def.name,
				def.queueOptions,
			);

			const worker = new Worker<Data, unknown, EventName>(
				def.name,
				async (job) => {
					const processor = def.processors?.[job.name as keyof S];
					if (!processor) {
						throw new Error(`No processor found for job: ${job.name}`);
					}
					await (processor as (data: Data, context: T) => Promise<void> | void)(
						job.data,
						context,
					);
				},
				def.workerOptions,
			);

			return { queue, worker };
		},
	};
}
