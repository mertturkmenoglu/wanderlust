type DefineStaticDataOptions = {
	breadcrumb?: string | ((data: any) => string);
};

export function defineStaticData(opts: DefineStaticDataOptions) {
	return opts;
}
