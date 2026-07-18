export type GeneratorDefinition = {
	generate: () => Promise<void>;
};

export function defineGenerator(def: GeneratorDefinition): GeneratorDefinition {
	return def;
}
