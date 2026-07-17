import { amenities } from './consts';
import { contract } from './contract';
import { dto as internal } from './dto';

export namespace Amenities {
	export const Contract = contract;
	export type Contract = typeof contract;
	export const values = amenities;

	export import dto = internal;
}
