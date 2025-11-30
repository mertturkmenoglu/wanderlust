// Type utilities

/**
 * Extract the element type of an array type
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Get the output type of an async function
 */
// biome-ignore lint/suspicious/noExplicitAny: Any is used here to allow all possible types
export type Output<T extends (...args: any) => any> = Awaited<ReturnType<T>>;
