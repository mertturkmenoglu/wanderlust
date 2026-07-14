import { customType } from 'drizzle-orm/pg-core';
import type { TAttribution, TOpeningHours, TRichTextFacet } from './types';

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

export const attributions = (name: string) =>
	customType<{
		data: TAttribution[];
		driverData: string;
	}>({
		dataType() {
			return 'jsonb';
		},
		fromDriver(value: string): TAttribution[] {
			if (typeof value === 'string') return JSON.parse(value) as TAttribution[];
			return value as TAttribution[]; // already parsed by some drivers
		},
		toDriver(value: TAttribution[]): string {
			return JSON.stringify(value);
		},
	})(name);

export const openingHours = (name: string) =>
	customType<{ data: TOpeningHours; driverData: string }>({
		dataType() {
			return 'jsonb';
		},
		fromDriver(value: string): TOpeningHours {
			if (typeof value === 'string') return JSON.parse(value) as TOpeningHours;
			return value as TOpeningHours; // already parsed by some drivers
		},
		toDriver(value: TOpeningHours): string {
			return JSON.stringify(value);
		},
	})(name);
