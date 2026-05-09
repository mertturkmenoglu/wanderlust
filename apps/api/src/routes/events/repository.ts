import { ORPCError } from '@orpc/server';
import { eq } from 'drizzle-orm';
import type { TDatabaseService } from '@/db';
import * as schema from '@/db/schema';
import { Pagination } from '@/lib/pagination';
import { nanoid } from '@/lib/uid';
import type * as dto from './dto';

export class EventsRepository {
	constructor(private readonly db: TDatabaseService) {}

	async get(_userId: string, data: dto.GetInput) {
		try {
			const event = await this.db.query.events.findFirst({
				where: (t, { eq }) => eq(t.id, data.id),
				with: {
					address: {
						with: {
							city: true,
						},
					},
					agenda: {
						with: {},
					},
					organizer: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					place: {
						with: {
							address: {
								with: {
									city: true,
								},
							},
							assets: true,
							category: true,
						},
					},
					assets: true,
					lineup: {
						with: {
							user: {
								columns: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
					ticketOptions: true,
				},
			});

			if (!event) {
				throw new ORPCError('NOT_FOUND', {
					message: `Event with id ${data.id} not found`,
				});
			}

			return event;
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}

			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to get event',
				cause: err,
			});
		}
	}

	async list(_userId: string, data: dto.ListInput) {
		const offset = Pagination.getOffset(data);

		try {
			const events = await this.db.query.events.findMany({
				orderBy: (t, { desc }) => desc(t.createdAt),
				offset,
				limit: data.pageSize,
				with: {
					address: {
						with: {
							city: true,
						},
					},
					agenda: {
						with: {},
					},
					organizer: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					place: {
						with: {
							address: {
								with: {
									city: true,
								},
							},
							assets: true,
							category: true,
						},
					},
					assets: true,
					lineup: {
						with: {
							user: {
								columns: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
					ticketOptions: true,
				},
			});

			return events;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list events',
				cause: err,
			});
		}
	}

	async create(userId: string, data: dto.CreateInput) {
		try {
			const [event] = await this.db
				.insert(schema.events)
				.values({
					id: nanoid(),
					title: data.title,
					description: data.description,
					startsAt: data.startsAt,
					endsAt: data.endsAt,
					addressId: data.addressId ?? null,
					externalUrl: data.externalUrl ?? null,
					ageRestriction: data.ageRestriction ?? null,
					amenities: data.amenities ?? null,
					refundPolicy: data.refundPolicy ?? null,
					faq: data.faq ?? null,
					placeId: data.placeId ?? null,
					isOnline: data.isOnline ?? null,
					recurrence: data.recurrence ?? null,
					categories: data.categories ?? null,
					organizerId: userId,
				})
				.returning();

			if (!event) {
				throw new Error('No event returned after insertion');
			}

			return await this.get(userId, { id: event.id });
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create event',
				cause: err,
			});
		}
	}

	async update(userId: string, data: dto.UpdateInput) {
		try {
			const [updated] = await this.db
				.update(schema.events)
				.set({
					title: data.title,
					description: data.description,
					startsAt: data.startsAt,
					endsAt: data.endsAt,
					addressId: data.addressId,
					externalUrl: data.externalUrl,
					ageRestriction: data.ageRestriction,
					amenities: data.amenities,
					refundPolicy: data.refundPolicy,
					faq: data.faq,
					placeId: data.placeId,
					isOnline: data.isOnline,
					recurrence: data.recurrence,
					categories: data.categories,
				})
				.where(eq(schema.events.id, data.id))
				.returning();

			if (!updated) {
				throw new ORPCError('NOT_FOUND', {
					message: `Event with id ${data.id} not found`,
				});
			}

			return await this.get(userId, { id: data.id });
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update event',
				cause: err,
			});
		}
	}

	async delete(_userId: string, data: dto.DeleteInput) {
		try {
			const res = await this.db
				.delete(schema.events)
				.where(eq(schema.events.id, data.id));

			if (res.rowCount === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: `Event with id ${data.id} not found`,
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete event',
				cause: err,
			});
		}
	}

	async updateAmenities(userId: string, data: dto.UpdateAmenitiesInput) {
		try {
			const [updated] = await this.db
				.update(schema.events)
				.set({
					amenities: data.amenities,
				})
				.where(eq(schema.events.id, data.id))
				.returning();

			if (!updated) {
				throw new ORPCError('NOT_FOUND', {
					message: `Event with id ${data.id} not found`,
				});
			}

			return await this.get(userId, { id: data.id });
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update event amenities',
				cause: err,
			});
		}
	}

	async updateFaq(userId: string, data: dto.UpdateFaqInput) {
		try {
			const [updated] = await this.db
				.update(schema.events)
				.set({
					faq: data.faq,
				})
				.where(eq(schema.events.id, data.id))
				.returning();

			if (!updated) {
				throw new ORPCError('NOT_FOUND', {
					message: `Event with id ${data.id} not found`,
				});
			}

			return await this.get(userId, { id: data.id });
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update event FAQ',
				cause: err,
			});
		}
	}

	async updateCategories(userId: string, data: dto.UpdateCategoriesInput) {
		try {
			const [updated] = await this.db
				.update(schema.events)
				.set({
					categories: data.categories,
				})
				.where(eq(schema.events.id, data.id))
				.returning();

			if (!updated) {
				throw new ORPCError('NOT_FOUND', {
					message: `Event with id ${data.id} not found`,
				});
			}

			return await this.get(userId, { id: data.id });
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update event categories',
				cause: err,
			});
		}
	}

	async updateTicketOptions(
		_userId: string,
		data: dto.UpdateTicketOptionsInput,
	) {
		try {
			// Remove existing options
			await this.db
				.delete(schema.eventTicketOptions)
				.where(eq(schema.eventTicketOptions.eventId, data.id));

			// Insert new ones
			if (data.ticketOptions.length > 0) {
				await this.db.insert(schema.eventTicketOptions).values(
					data.ticketOptions.map((opt) => ({
						id: nanoid(),
						eventId: data.id,
						name: opt.name,
						description: opt.description,
						fee: opt.fee,
						currency: opt.currency,
						totalAvailability: opt.totalAvailability,
						currentAvailability: opt.currentAvailability,
					})),
				);
			}

			// Return current options
			const options = await this.db.query.eventTicketOptions.findMany({
				where: (t, { eq }) => eq(t.eventId, data.id),
			});

			return options;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update ticket options',
				cause: err,
			});
		}
	}

	async updateAgenda(_userId: string, data: dto.UpdateAgendaInput) {
		try {
			// Remove existing agenda
			await this.db
				.delete(schema.eventAgendaItems)
				.where(eq(schema.eventAgendaItems.eventId, data.id));

			// Insert new agenda items
			if (data.agenda.length > 0) {
				await this.db.insert(schema.eventAgendaItems).values(
					data.agenda.map((item) => ({
						id: nanoid(),
						eventId: data.id,
						startsAt: item.startsAt,
						endsAt: item.endsAt,
						title: item.title,
						description: item.description,
					})),
				);
			}

			// Return current agenda
			const agenda = await this.db.query.eventAgendaItems.findMany({
				where: (t, { eq }) => eq(t.eventId, data.id),
			});

			return agenda;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update agenda',
				cause: err,
			});
		}
	}

	async updateLineup(_userId: string, data: dto.UpdateLineupInput) {
		try {
			// Remove existing lineup
			await this.db
				.delete(schema.eventLineupItems)
				.where(eq(schema.eventLineupItems.eventId, data.id));

			// Insert new lineup items
			if (data.lineup.length > 0) {
				await this.db.insert(schema.eventLineupItems).values(
					data.lineup.map((item) => ({
						id: nanoid(),
						eventId: data.id,
						name: item.name,
						userId: item.userId,
						badge: item.badge,
						title: item.title,
						description: item.description,
						order: item.order,
					})),
				);
			}

			// Return current lineup
			const lineup = await this.db.query.eventLineupItems.findMany({
				where: (t, { eq }) => eq(t.eventId, data.id),
				with: {
					user: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
				},
			});

			return lineup;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update lineup',
				cause: err,
			});
		}
	}

	async createAsset(_userId: string, data: dto.CreateAssetInput) {
		try {
			const [asset] = await this.db
				.insert(schema.assets)
				.values({
					entityType: 'event',
					entityId: data.eventId,
					url: data.url,
					description: data.description ?? null,
					order: data.order ?? 1,
				})
				.returning();

			if (!asset) {
				throw new Error('No asset returned after insertion');
			}

			return asset;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to create asset',
				cause: err,
			});
		}
	}

	async updateAssets(_userId: string, data: dto.UpdateAssetsInput) {
		try {
			// Remove existing assets for this event
			await this.db
				.delete(schema.assets)
				.where(eq(schema.assets.entityId, data.eventId));

			// Insert new assets
			let inserted: Array<typeof schema.assets.$inferSelect> = [];
			if (data.assets.length > 0) {
				inserted = await this.db
					.insert(schema.assets)
					.values(
						data.assets.map((a) => ({
							entityType: 'event' as const,
							entityId: data.eventId,
							url: a.url,
							description: a.description ?? null,
							order: a.order ?? 1,
						})),
					)
					.returning();
			}

			return inserted;
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to update assets',
				cause: err,
			});
		}
	}

	async deleteAsset(_userId: string, data: dto.DeleteAssetInput) {
		try {
			const res = await this.db
				.delete(schema.assets)
				.where(eq(schema.assets.id, data.id));

			if (res.rowCount === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: `Asset with id ${data.id} not found`,
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete asset',
				cause: err,
			});
		}
	}

	async addToInterestedEvents(
		userId: string,
		data: dto.AddToInterestedEventsInput,
	) {
		try {
			const [favorite] = await this.db
				.insert(schema.favorites)
				.values({
					userId,
					placeId: data.id,
				})
				.returning();

			if (!favorite) {
				throw new Error('No favorite returned after insertion');
			}
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to add to interested events',
				cause: err,
			});
		}
	}

	async listMyInterestedEvents(
		_userId: string,
		data: dto.ListMyInterestedEventsInput,
	) {
		const offset = Pagination.getOffset(data);

		try {
			const events = await this.db.query.events.findMany({
				orderBy: (t, { desc }) => desc(t.createdAt),
				offset,
				limit: data.pageSize,
				with: {
					address: {
						with: {
							city: true,
						},
					},
					agenda: {
						with: {},
					},
					organizer: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					place: {
						with: {
							address: {
								with: {
									city: true,
								},
							},
							assets: true,
							category: true,
						},
					},
					assets: true,
					lineup: {
						with: {
							user: {
								columns: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
					ticketOptions: true,
				},
			});

			const totalItems = await this.db.$count(schema.events);

			const pagination = Pagination.compute(data, totalItems);

			return {
				events,
				pagination,
			};
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list interested events',
				cause: err,
			});
		}
	}

	async deleteFromMyInterestedEvents(
		_userId: string,
		data: dto.DeleteFromMyInterestedEventsInput,
	) {
		try {
			const res = await this.db
				.delete(schema.favorites)
				.where(eq(schema.favorites.placeId, data.id));

			if (res.rowCount === 0) {
				throw new ORPCError('NOT_FOUND', {
					message: 'Interested event not found',
				});
			}
		} catch (err) {
			if (err instanceof ORPCError) {
				throw err;
			}
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to delete from interested events',
				cause: err,
			});
		}
	}

	async listByPlaceId(_userId: string, data: dto.ListByPlaceIdInput) {
		const offset = Pagination.getOffset(data);

		try {
			const events = await this.db.query.events.findMany({
				where: (t, { eq }) => eq(t.placeId, data.placeId),
				orderBy: (t, { desc }) => desc(t.createdAt),
				offset,
				limit: data.pageSize,
				with: {
					address: {
						with: {
							city: true,
						},
					},
					agenda: {
						with: {},
					},
					organizer: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					place: {
						with: {
							address: {
								with: {
									city: true,
								},
							},
							assets: true,
							category: true,
						},
					},
					assets: true,
					lineup: {
						with: {
							user: {
								columns: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
					ticketOptions: true,
				},
			});

			const totalItems = await this.db.$count(
				schema.events,
				eq(schema.events.placeId, data.placeId),
			);

			const pagination = Pagination.compute(data, totalItems);

			return {
				events,
				pagination,
			};
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list events by placeId',
				cause: err,
			});
		}
	}

	async listByOrganizerId(_userId: string, data: dto.ListByOrganizerIdInput) {
		const offset = Pagination.getOffset(data);

		try {
			const events = await this.db.query.events.findMany({
				where: (t, { eq }) => eq(t.organizerId, data.organizerId),
				orderBy: (t, { desc }) => desc(t.createdAt),
				offset,
				limit: data.pageSize,
				with: {
					address: {
						with: {
							city: true,
						},
					},
					agenda: {
						with: {},
					},
					organizer: {
						columns: {
							id: true,
							name: true,
							username: true,
							image: true,
						},
					},
					place: {
						with: {
							address: {
								with: {
									city: true,
								},
							},
							assets: true,
							category: true,
						},
					},
					assets: true,
					lineup: {
						with: {
							user: {
								columns: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
					ticketOptions: true,
				},
			});

			const totalItems = await this.db.$count(
				schema.events,
				eq(schema.events.organizerId, data.organizerId),
			);

			const pagination = Pagination.compute(data, totalItems);

			return {
				events,
				pagination,
			};
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list events by organizerId',
				cause: err,
			});
		}
	}

	async listInterestedFriends(
		_userId: string,
		data: dto.ListInterestedFriendsInput,
	) {
		const offset = Pagination.getOffset(data);

		try {
			const users = await this.db.query.users.findMany({
				orderBy: (t, { desc }) => desc(t.createdAt),
				offset,
				limit: data.pageSize,
				columns: {
					id: true,
					name: true,
					username: true,
					image: true,
				},
			});

			const totalItems = await this.db.$count(schema.users);

			const pagination = Pagination.compute(data, totalItems);

			return {
				users,
				pagination,
			};
		} catch (err) {
			throw new ORPCError('INTERNAL_SERVER_ERROR', {
				message: 'Failed to list interested friends',
				cause: err,
			});
		}
	}
}
