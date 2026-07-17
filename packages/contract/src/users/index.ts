import { contract } from './contract';
import { dto as internal } from './dto';

export namespace Users {
	export const Contract = contract;
	export type Contract = typeof contract;

	export import dto = internal;
}
