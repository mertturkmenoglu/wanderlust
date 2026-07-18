import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Accolade } from './accolades';
import { Asset } from './assets';
import { Category } from './categories';
import { City } from './cities';
import { Resources } from './resources';
import { Url } from './url';

export const Place = createSelectSchema(schema.places, {
	amenities: z.array(z.string()).meta({
		description:
			'Array of amenity IDs with .0 and .1 suffixes. (.0=Not supported, .1=Supported)',
		examples: [['wifi.1', 'parking.0']],
	}),
	paymentOptions: z.array(z.string()).meta({
		description:
			'Array of payment options with .0 and .1 suffixes. (.0=Not supported, .1=Supported)',
		examples: [['cash.1', 'cc.1', 'mobile.0']],
	}),
	parkingOptions: z.array(z.string()).meta({
		description:
			'Array of parking options with .0 and .1 suffixes. (.0=Not supported, .1=Supported)',
		examples: [['free_street.1', 'paid_lot.0']],
	}),
	accessibilityOptions: z.array(z.string()).meta({
		description:
			'Array of accessibility options with .0 and .1 suffixes. (.0=Not supported, .1=Supported)',
		examples: [['parking.1', 'entrance.0', 'restroom.1', 'seating.1']],
	}),
	openingHours: z
		.object({
			regular: z.array(
				z.object({
					day: z.string().meta({
						description: 'Day of the week (2-letter abbreviation)',
						examples: ['mn', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
					}),
					intervals: z.array(
						z.object({
							off: z.boolean().meta({
								description: 'Whether the place is closed for the interval',
								examples: [false],
							}),
							open: z
								.string()
								.regex(/^\d{2}:\d{2}$/)
								.meta({
									description: 'Opening time in ISO 8601 time format (HH:mm)',
									examples: ['09:00'],
								}),
							close: z
								.string()
								.regex(/^\d{2}:\d{2}$/)
								.meta({
									description: 'Closing time in ISO 8601 time format (HH:mm)',
									examples: ['17:00'],
								}),
						}),
					),
				}),
			),
			special: z.array(
				z.object({
					rule: z.string().meta({
						description:
							'Rule for special days (e.g., PH for public holidays, or a specific date in YYYY-MM-DD format)',
						examples: ['PH', '2023-12-25'],
					}),
					intervals: z.array(
						z.object({
							off: z.boolean().meta({
								description: 'Whether the place is closed for the interval',
								examples: [false],
							}),
							open: z
								.string()
								.regex(/^\d{2}:\d{2}$/)
								.meta({
									description: 'Opening time in ISO 8601 time format (HH:mm)',
									examples: ['09:00'],
								}),
							close: z
								.string()
								.regex(/^\d{2}:\d{2}$/)
								.meta({
									description: 'Closing time in ISO 8601 time format (HH:mm)',
									examples: ['17:00'],
								}),
						}),
					),
				}),
			),
		})
		.meta({
			description: 'Opening hours information for the place',
		}),
	websites: z.array(Url).meta({
		description: 'Array of website URLs associated with the place',
		examples: [['https://example.com', 'https://facebook.com/place123']],
	}),
	socials: z.array(Url).meta({
		description: 'Array of social media URLs associated with the place',
		examples: [
			['https://twitter.com/place123', 'https://instagram.com/place123'],
		],
	}),
	secondaryCategoryIds: z.array(Resources.id).meta({
		description: 'Array of secondary category IDs associated with the place',
		examples: [['category456', 'category789']],
	}),
}).meta({
	description: 'A place entity',
});

export namespace Places {
	export const Extended = Place.extend({
		assets: z.array(Asset),
		city: City,
		primaryCategory: Category,
		accolades: z.array(Accolade),
	});

	export type Extended = z.infer<typeof Extended>;

	export const Meta = z.object({
		isFavorite: z.boolean().meta({
			description: 'Whether the place is marked as a favorite by the user',
			examples: [true],
		}),
	});

	export type Meta = z.infer<typeof Meta>;

	export namespace $Insert {
		export const Place = createInsertSchema(schema.places, {
			amenities: z
				.string()
				.array()
				.meta({
					description:
						'Array of amenity IDs with .0 and .1 suffixes. (.0=Not supported, .1=Supported)',
					examples: [['wifi.1', 'parking.0']],
				}),
			paymentOptions: z.array(z.string()).meta({
				description:
					'Array of payment options with .0 and .1 suffixes. (.0=Not supported, .1=Supported)',
				examples: [['cash.1', 'cc.1', 'mobile.0']],
			}),
			parkingOptions: z.array(z.string()).meta({
				description:
					'Array of parking options with .0 and .1 suffixes. (.0=Not supported, .1=Supported)',
				examples: [['free_street.1', 'paid_lot.0']],
			}),
			accessibilityOptions: z.array(z.string()).meta({
				description:
					'Array of accessibility options with .0 and .1 suffixes. (.0=Not supported, .1=Supported)',
				examples: [['parking.1', 'entrance.0', 'restroom.1', 'seating.1']],
			}),
			openingHours: z
				.object({
					regular: z.array(
						z.object({
							day: z.string().meta({
								description: 'Day of the week (2-letter abbreviation)',
								examples: ['mn', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
							}),
							intervals: z.array(
								z.object({
									off: z.boolean().meta({
										description: 'Whether the place is closed for the interval',
										examples: [false],
									}),
									open: z
										.string()
										.regex(/^\d{2}:\d{2}$/)
										.meta({
											description:
												'Opening time in ISO 8601 time format (HH:mm)',
											examples: ['09:00'],
										}),
									close: z
										.string()
										.regex(/^\d{2}:\d{2}$/)
										.meta({
											description:
												'Closing time in ISO 8601 time format (HH:mm)',
											examples: ['17:00'],
										}),
								}),
							),
						}),
					),
					special: z.array(
						z.object({
							rule: z.string().meta({
								description:
									'Rule for special days (e.g., PH for public holidays, or a specific date in YYYY-MM-DD format)',
								examples: ['PH', '2023-12-25'],
							}),
							intervals: z.array(
								z.object({
									off: z.boolean().meta({
										description: 'Whether the place is closed for the interval',
										examples: [false],
									}),
									open: z
										.string()
										.regex(/^\d{2}:\d{2}$/)
										.meta({
											description:
												'Opening time in ISO 8601 time format (HH:mm)',
											examples: ['09:00'],
										}),
									close: z
										.string()
										.regex(/^\d{2}:\d{2}$/)
										.meta({
											description:
												'Closing time in ISO 8601 time format (HH:mm)',
											examples: ['17:00'],
										}),
								}),
							),
						}),
					),
				})
				.meta({
					description: 'Opening hours information for the place',
				}),
			websites: z.array(z.url()).meta({
				description: 'Array of website URLs associated with the place',
				examples: [['https://example.com', 'https://facebook.com/place123']],
			}),
			socials: z.array(z.url()).meta({
				description: 'Array of social media URLs associated with the place',
				examples: [
					['https://twitter.com/place123', 'https://instagram.com/place123'],
				],
			}),
			secondaryCategoryIds: z.array(z.string()).meta({
				description:
					'Array of secondary category IDs associated with the place',
				examples: [['category456', 'category789']],
			}),
		});

		export type Place = z.infer<typeof Place>;
	}
}
