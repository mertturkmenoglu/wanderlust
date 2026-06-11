import type { NotificationsAppType } from '@wanderlust/notifications';
import { hc } from 'hono/client';

export const notificationsClient = hc<NotificationsAppType>(
	'http://localhost:5001',
	{
		init: {
			credentials: 'include',
		},
	},
);
