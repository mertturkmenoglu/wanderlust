import { customType } from 'drizzle-orm/pg-core';
import type { TRichTextFacet } from './types';

export const reviewFacets = (name: string) =>
	customType<{ data: TRichTextFacet[]; driverData: string }>({
		dataType() {
			return 'jsonb';
		},
		fromDriver(value: string): TRichTextFacet[] {
			if (typeof value === 'string')
				return JSON.parse(value) as TRichTextFacet[];
			return value as TRichTextFacet[]; // already parsed by some drivers
		},
		toDriver(value: TRichTextFacet[]): string {
			return JSON.stringify(value);
		},
	})(name);
