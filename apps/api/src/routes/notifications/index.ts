import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { ClearNotificationsMethod } from './methods/clear';
import { ListNotificationsMethod } from './methods/list';
import { MarkAllNotificationsReadMethod } from './methods/mark-all-read';
import { MarkNotificationReadMethod } from './methods/mark-read';
import { GetNotificationPreferencesMethod } from './methods/preferences';
import { UpdateNotificationPreferencesMethod } from './methods/update-preferences';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		ListNotificationsMethod,
		MarkNotificationReadMethod,
		MarkAllNotificationsReadMethod,
		ClearNotificationsMethod,
		GetNotificationPreferencesMethod,
		UpdateNotificationPreferencesMethod,
	],
	router: () => {
		const list = container.get(ListNotificationsMethod);
		const markRead = container.get(MarkNotificationReadMethod);
		const markAllRead = container.get(MarkAllNotificationsReadMethod);
		const clear = container.get(ClearNotificationsMethod);
		const preferences = container.get(GetNotificationPreferencesMethod);
		const update = container.get(UpdateNotificationPreferencesMethod);

		return os.router({
			list: list.route(),
			markRead: markRead.route(),
			markAllRead: markAllRead.route(),
			clear: clear.route(),
			preferences: preferences.route(),
			updatePreferences: update.route(),
		});
	},
});
