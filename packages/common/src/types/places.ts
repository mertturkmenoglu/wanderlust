import { schema } from '@wanderlust/db';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod';
import { Accolade } from './accolades';
import { Asset } from './assets';
import { Category } from './categories';
import { City } from './cities';
import { Resources } from './resources';
import { Timestamp } from './timestamp';
import { Url } from './url';

export const Place = createSelectSchema(schema.places, {
	id: Resources.id,
	name: z
		.string()
		.min(1)
		.max(255)
		.meta({
			description: 'Name of the place',
			examples: ['Central Park', 'Eiffel Tower'],
		}),
	description: z
		.string()
		.min(1)
		.max(2048)
		.meta({
			description: 'Description of the place',
			examples: [
				'A large public park in New York City.',
				'An iconic landmark in Paris, France.',
			],
		}),
	status: z
		.enum(['unknown', 'operational', 'closed_temp', 'closed_perm', 'future'])
		.meta({
			description: 'Operational status of the place',
			examples: ['operational', 'closed_temp'],
		}),
	intlPhone: z
		.string()
		.nullable()
		.meta({
			description: 'International phone number in E.164 format',
			examples: ['+14155552671'],
		}),
	primaryCategoryId: Resources.id,
	priceLevel: z
		.enum([
			'unknown',
			'free',
			'cheap',
			'moderate',
			'expensive',
			'very_expensive',
		])
		.meta({
			description: 'Price level of the place',
			examples: ['cheap', 'moderate'],
		}),
	accessibilityLevel: z
		.enum([
			'unknown',
			'not_accessible',
			'partially_accessible',
			'highly_accessible',
		])
		.meta({
			description: 'Accessibility level of the place',
			examples: ['partially_accessible', 'highly_accessible'],
		}),
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
	totalVotes: z
		.number()
		.int()
		.nonnegative()
		.meta({
			description: 'Total number of votes received by the place',
			examples: [100],
		}),
	totalPoints: z
		.number()
		.int()
		.nonnegative()
		.meta({
			description: 'Total points accumulated from votes',
			examples: [450],
		}),
	rating: z
		.number()
		.min(0)
		.max(5)
		.meta({
			description: 'Average rating of the place (0 to 5)',
			examples: [4.5],
		}),
	totalFavorites: z
		.number()
		.int()
		.nonnegative()
		.meta({
			description:
				'Total number of times the place has been marked as favorite',
			examples: [50],
		}),
	countryCode: z
		.string()
		.length(2)
		.meta({
			description: 'ISO 3166-1 alpha-2 country code of the place',
			examples: ['US', 'FR'],
		}),
	countryName: z.string().meta({
		description: 'Country name of the place',
		examples: ['United States', 'France'],
	}),
	adminAreaCode: z.string().meta({
		description:
			'ISO 3166-2 subdivision code (e.g., US-CA for California, United States)',
		examples: ['US-CA', 'FR-IDF'],
	}),
	adminAreaName: z.string().meta({
		description: 'Subdivision name (e.g., state or province) of the place',
		examples: ['California', 'Île-de-France'],
	}),
	locality: z.string().meta({
		description: 'City or town name of the place',
		examples: ['Los Angeles', 'Paris'],
	}),
	subLocality: z
		.string()
		.nullable()
		.meta({
			description: 'Neighborhood or district name of the place',
			examples: ['Hollywood', 'Le Marais'],
		}),
	postalCode: z
		.string()
		.nullable()
		.meta({
			description: 'Postal code of the place',
			examples: ['90028', '75003'],
		}),
	addressLine: z.string().meta({
		description: 'Full address line of the place',
		examples: [
			'123 Main St, Los Angeles, CA 90028',
			'10 Rue de Rivoli, 75001 Paris',
		],
	}),
	lat: z.number().meta({
		description: 'Latitude coordinate of the place',
		examples: [34.0522, 48.8566],
	}),
	lng: z.number().meta({
		description: 'Longitude coordinate of the place',
		examples: [-118.2437, 2.3522],
	}),
	wlCityId: Resources.id.meta({
		description: 'ID of the city in the Wanderlust database',
		examples: ['city123', 'city456'],
	}),
	createdAt: Timestamp,
	updatedAt: Timestamp,
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
