import { type Span, SpanStatusCode, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('wl');

export async function wrap<T>(
	name: string,
	doWork: (span: Span) => Promise<T>,
) {
	return tracer.startActiveSpan(name, async (span) => {
		try {
			const result = await doWork(span);
			return result;
		} catch (err) {
			span.recordException(err as Error);
			span.setStatus({
				code: SpanStatusCode.ERROR,
				message: (err as Error).message,
			});
			throw err;
		} finally {
			span.end();
		}
	});
}

export function Trace(name?: string): MethodDecorator {
	return (target, propertyKey, descriptor: PropertyDescriptor) => {
		const original = descriptor.value;
		const spanName =
			name ?? `${target.constructor.name}.${String(propertyKey)}`;

		descriptor.value = function (this: unknown, ...args: unknown[]) {
			return wrap(spanName, (_span: Span) =>
				Promise.resolve(original.apply(this, args)),
			);
		};

		return descriptor;
	};
}

export function TraceAll(): ClassDecorator {
	return (target: any) => {
		const proto = target.prototype;
		const className = target.name;

		for (const key of Object.getOwnPropertyNames(proto)) {
			if (key === 'constructor') continue;

			const descriptor = Object.getOwnPropertyDescriptor(proto, key);
			if (!descriptor || typeof descriptor.value !== 'function') continue;

			const original = descriptor.value;
			const spanName = `${className}.${key}`;

			descriptor.value = function (this: unknown, ...args: unknown[]) {
				return wrap(spanName, (_span: Span) =>
					Promise.resolve(original.apply(this, args)),
				);
			};

			Object.defineProperty(proto, key, descriptor);
		}

		return target;
	};
}
