import { contract } from './contract';
import { dto as internal } from './dto';

export namespace Reports {
	export const Contract = contract;
	export type Contract = typeof contract;

	export import dto = internal;
}
