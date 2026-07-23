/** biome-ignore-all lint/suspicious/noExplicitAny: Any usage here is ok because we don't know the function argument types */
type DefineCacheOptionsVars = {
	namespace: string;
	keys: Record<string, string | ((...args: any[]) => string)>;
	ttl: Record<string, string | ((...args: any[]) => string)>;
	grace: Record<string, string | ((...args: any[]) => string)>;
};

/**
 * IFF Define cache options for a specific namespace, including keys, TTL, and grace periods.
 * @param opts - The cache options to define, including namespace, keys, TTL, and grace periods.
 * @returns the provided cache options, allowing for type inference and validation of the structure.
 */
export function defineCacheOptions<T extends DefineCacheOptionsVars>(opts: T) {
	return opts;
}
