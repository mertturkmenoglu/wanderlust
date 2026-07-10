import { z } from 'zod';

export const tripInviteNotificationSchema = z.object({
	data: z.object({
		trip: z.object({
			id: z.string(),
			title: z.string(),
		}),
		role: z.string(),
		from: z.object({
			id: z.string(),
			name: z.string(),
			username: z.string(),
			image: z.string().nullable(),
		}),
	}),
});

export const tripAddUserNotificationSchema = z.object({
	data: z.object({
		newUser: z.object({
			id: z.string(),
			name: z.string(),
			username: z.string(),
			image: z.string().nullable(),
		}),
	}),
});

export const tripNewCommentNotificationSchema = z.object({
	data: z.object({
		trip: z.object({
			id: z.string(),
			title: z.string(),
		}),
	}),
});

export const tripUpdateNotificationSchema = z.object({
	data: z.object({
		trip: z.object({
			id: z.string(),
			title: z.string(),
		}),
	}),
});

export const followNotificationSchema = z.object({
	data: z.object({
		follower: z.object({
			id: z.string(),
			name: z.string(),
			username: z.string(),
			image: z.string().nullable(),
		}),
	}),
});

export const mentionNotificationSchema = z.object({
	review: z.object({
		id: z.string(),
		place: z.object({
			id: z.string(),
			name: z.string(),
		}),
		user: z.object({
			id: z.string(),
			name: z.string(),
			username: z.string(),
			image: z.string().nullable(),
		}),
	}),
});
