import { createFileRoute } from '@tanstack/react-router';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { Switch } from '@wanderlust/ui/components/switch';
import { toast } from 'sonner';
import { notificationsClient } from '@/lib/notifications';
import {
	type TNotificationCategory,
	type TNotificationChannel,
	useNotificationsContext,
} from '@/stores/notifications-context';

export const Route = createFileRoute('/settings/notifications/')({
	component: RouteComponent,
});

function RouteComponent() {
	const ctx = useNotificationsContext();

	const isEnabled = (
		channel: TNotificationChannel,
		category: TNotificationCategory,
	) => {
		const pref = ctx.preferences.find(
			(p) => p.channel === channel && p.category === category,
		);

		if (!pref) {
			return false;
		}

		return pref.enabled;
	};

	const update = async (
		channel: TNotificationChannel,
		category: TNotificationCategory,
		enabled: boolean,
	) => {
		const res = await notificationsClient.preferences.$patch({
			json: {
				userId: '',
				category,
				channel,
				enabled,
			},
		});

		if (!res.ok) {
			toast.error('Failed to update preferences');
			return;
		}

		await ctx.refetchPreferences();
		toast.success('Notification preferences updated');
	};

	if (ctx.isPreferencesLoading) {
		return (
			<FieldSet>
				<FieldLegend>Notifications</FieldLegend>
				<FieldDescription>
					Change your notification preferences
				</FieldDescription>

				<FieldSeparator />

				<Spinner className="mx-auto my-8 size-12" />
			</FieldSet>
		);
	}
	return (
		<FieldSet>
			<FieldLegend>Notifications</FieldLegend>
			<FieldDescription>Change your notification preferences</FieldDescription>

			<FieldSeparator />

			<FieldSet>
				<FieldLegend>Email Notifications</FieldLegend>

				<FieldGroup>
					<Field orientation="horizontal" className="max-w-md">
						<FieldContent>
							<FieldLabel htmlFor="system-emails">System Emails</FieldLabel>
							<FieldDescription>
								You cannot disable this type of emails. We can send you emails
								about your account security, legal issues, important system
								updates.
							</FieldDescription>
						</FieldContent>
						<Switch id="system-emails" checked disabled />
					</Field>

					<Field orientation="horizontal" className="max-w-md">
						<FieldContent>
							<FieldLabel htmlFor="digest-emails">Digest</FieldLabel>
							<FieldDescription>
								Weekly summaries of your activities.
							</FieldDescription>
						</FieldContent>
						<Switch
							id="digest-emails"
							checked={isEnabled('email', 'digest')}
							onCheckedChange={(checked) => update('email', 'digest', checked)}
						/>
					</Field>

					<Field orientation="horizontal" className="max-w-md">
						<FieldContent>
							<FieldLabel htmlFor="recommendation-emails">
								Recommendations
							</FieldLabel>
							<FieldDescription>
								Weekly recommendations for new places, lists, and trips.
							</FieldDescription>
						</FieldContent>
						<Switch
							id="recommendation-emails"
							checked={isEnabled('email', 'recommendation')}
							onCheckedChange={(checked) =>
								update('email', 'recommendation', checked)
							}
						/>
					</Field>

					<Field orientation="horizontal" className="max-w-md">
						<FieldContent>
							<FieldLabel htmlFor="anniversary-emails">
								Anniversary Reminders
							</FieldLabel>
							<FieldDescription>
								Reminders for your previous trips.
							</FieldDescription>
						</FieldContent>
						<Switch
							id="anniversary-emails"
							checked={isEnabled('email', 'anniversary')}
							onCheckedChange={(checked) =>
								update('email', 'anniversary', checked)
							}
						/>
					</Field>

					<Field orientation="horizontal" className="max-w-md">
						<FieldContent>
							<FieldLabel htmlFor="upcoming-trip-emails">
								Upcoming Trips
							</FieldLabel>
							<FieldDescription>
								Reminders for your upcoming trips.
							</FieldDescription>
						</FieldContent>
						<Switch
							id="upcoming-trip-emails"
							checked={isEnabled('email', 'upcoming-trips')}
							onCheckedChange={(checked) =>
								update('email', 'upcoming-trips', checked)
							}
						/>
					</Field>
				</FieldGroup>
			</FieldSet>

			<FieldSeparator />

			<FieldSet>
				<FieldLegend>In App Notifications</FieldLegend>

				<FieldGroup>
					<Field orientation="horizontal" className="max-w-md">
						<FieldContent>
							<FieldLabel htmlFor="system-notifications">
								System Notifications
							</FieldLabel>
							<FieldDescription>
								You cannot disable this type of notifications. We can send you
								notifications about your account security, legal issues,
								important system updates.
							</FieldDescription>
						</FieldContent>
						<Switch id="system-notifications" checked disabled />
					</Field>

					<Field orientation="horizontal" className="max-w-md">
						<FieldContent>
							<FieldLabel htmlFor="digest-notifications">Digest</FieldLabel>
							<FieldDescription>
								Weekly summaries of your activities.
							</FieldDescription>
						</FieldContent>
						<Switch
							id="digest-notifications"
							checked={isEnabled('in_app', 'digest')}
							onCheckedChange={(checked) => update('in_app', 'digest', checked)}
						/>
					</Field>

					<Field orientation="horizontal" className="max-w-md">
						<FieldContent>
							<FieldLabel htmlFor="recommendation-notifications">
								Recommendations
							</FieldLabel>
							<FieldDescription>
								Weekly recommendations for new places, lists, and trips.
							</FieldDescription>
						</FieldContent>
						<Switch
							id="recommendation-notifications"
							checked={isEnabled('in_app', 'recommendation')}
							onCheckedChange={(checked) =>
								update('in_app', 'recommendation', checked)
							}
						/>
					</Field>

					<Field orientation="horizontal" className="max-w-md">
						<FieldContent>
							<FieldLabel htmlFor="anniversary-notifications">
								Anniversary Reminders
							</FieldLabel>
							<FieldDescription>
								Reminders for your previous trips.
							</FieldDescription>
						</FieldContent>
						<Switch
							id="anniversary-notifications"
							checked={isEnabled('in_app', 'anniversary')}
							onCheckedChange={(checked) =>
								update('in_app', 'anniversary', checked)
							}
						/>
					</Field>

					<Field orientation="horizontal" className="max-w-md">
						<FieldContent>
							<FieldLabel htmlFor="upcoming-trip-notifications">
								Upcoming Trips
							</FieldLabel>
							<FieldDescription>
								Reminders for your upcoming trips.
							</FieldDescription>
						</FieldContent>
						<Switch
							id="upcoming-trip-notifications"
							checked={isEnabled('in_app', 'upcoming-trips')}
							onCheckedChange={(checked) =>
								update('in_app', 'upcoming-trips', checked)
							}
						/>
					</Field>
				</FieldGroup>
			</FieldSet>
		</FieldSet>
	);
}
