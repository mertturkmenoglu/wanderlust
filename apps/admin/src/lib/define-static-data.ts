type DefineStaticDataOptions = {
	// biome-ignore lint/suspicious/noExplicitAny: any usage here is intentional
	breadcrumb?: string | ((data: any) => string);
};

export function defineStaticData(opts: DefineStaticDataOptions) {
	return opts;
}
