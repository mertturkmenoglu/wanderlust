export function TaggedError(tag: string) {
	return class extends Error {
		readonly _tag = tag;

		constructor(message: string, options?: ErrorOptions) {
			super(message, options);
			this._tag = tag;
		}
	};
}
