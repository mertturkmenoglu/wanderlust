import type { TDatabaseService } from "./service";

type Query = TDatabaseService['query'];

type Domain = keyof Query;

type With<TDomain extends Domain> = NonNullable<Parameters<TDatabaseService['query'][TDomain]['findFirst']>[0]>['with'];

const withAddress = {
	city: true
} satisfies With<'addresses'>;

const withAccolade = {
	accolade: true,
} satisfies With<'accoladeAssignments'>;

const withPlace = {
	address: {
		with: withAddress,
	},
	accolades: {
		with: withAccolade,
	},
	category: true,
	assets: true,
} satisfies With<'places'>;

export const $includes = {
	accolade: withAccolade,
	address: withAddress,
	place: withPlace,
};
