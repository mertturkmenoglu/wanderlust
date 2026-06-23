import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { Switch } from '@wanderlust/ui/components/switch';
import { useTheme } from 'next-themes';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { useUpdatePreferences } from '@/hooks/use-update-preferences';
import { timezoneOffsets } from '@/lib/timezone';
import type { TPreferences } from '@/stores/preferences-context';
import {
	mapStyleOptions,
	searchRadiusOptions,
	themeOptions,
	unitsOptions,
} from './-utils';

export function PreferencesForm() {
	const form = useFormContext<TPreferences>();
	const mutation = useUpdatePreferences();
	const { setTheme } = useTheme();

	return (
		<form
			id="preferences-form"
			className="w-full"
			onSubmit={form.handleSubmit((data) => {
				mutation.mutate(data, {
					onSuccess: (result) => {
						toast.success('Preferences updated successfully');

						setTheme(result.preferences.theme);
					},
				});
			})}
		>
			<FieldSet>
				<FieldLegend className="text-xl!">Preferences</FieldLegend>
				<FieldDescription>Change your application preferences</FieldDescription>

				<FieldSeparator />

				<FieldSet>
					<FieldLegend>General</FieldLegend>

					<FieldGroup>
						<Controller
							name="theme"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									orientation="horizontal"
								>
									<FieldContent>
										<FieldLabel htmlFor="theme">Theme</FieldLabel>
										<FieldDescription>
											Select your preferred theme for the application
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</FieldDescription>
									</FieldContent>

									<Select
										name={field.name}
										value={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger
											id="theme"
											aria-invalid={fieldState.invalid}
											className="min-w-32"
										>
											<SelectValue placeholder="Theme" />
										</SelectTrigger>
										<SelectContent position="popper" align="end">
											{themeOptions.map(({ key, label }) => (
												<SelectItem key={key} value={key}>
													{label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						<Controller
							name="units"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									orientation="horizontal"
								>
									<FieldContent>
										<FieldLabel htmlFor="units">Units</FieldLabel>
										<FieldDescription>
											Select your preferred units for distance and temperature
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</FieldDescription>
									</FieldContent>

									<Select
										name={field.name}
										value={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger
											id="units"
											aria-invalid={fieldState.invalid}
											className="min-w-32"
										>
											<SelectValue placeholder="Units" />
										</SelectTrigger>
										<SelectContent position="popper" align="end">
											{unitsOptions.map(({ key, label }) => (
												<SelectItem key={key} value={key}>
													{label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						<Controller
							name="mapStyle"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									orientation="horizontal"
								>
									<FieldContent>
										<FieldLabel htmlFor="mapStyle">Map Style</FieldLabel>
										<FieldDescription>
											Control how maps are displayed in the app
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</FieldDescription>
									</FieldContent>

									<Select
										name={field.name}
										value={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger
											id="mapStyle"
											aria-invalid={fieldState.invalid}
											className="min-w-32"
										>
											<SelectValue placeholder="Map style" />
										</SelectTrigger>
										<SelectContent position="popper" align="end">
											{mapStyleOptions.map(({ key, label }) => (
												<SelectItem key={key} value={key}>
													{label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						<Controller
							name="timezone"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									orientation="horizontal"
								>
									<FieldContent>
										<FieldLabel htmlFor="timezone">Timezone</FieldLabel>
										<FieldDescription>
											Your preferred timezone
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</FieldDescription>
									</FieldContent>

									<Select
										name={field.name}
										value={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger
											id="timezone"
											aria-invalid={fieldState.invalid}
											className="min-w-32"
										>
											<SelectValue placeholder="Timezone" />
										</SelectTrigger>
										<SelectContent position="popper" align="end">
											{timezoneOffsets.map((offset) => (
												<SelectItem key={offset} value={offset}>
													{offset}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						<Controller
							name="searchRadius"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									orientation="horizontal"
								>
									<FieldContent>
										<FieldLabel htmlFor="searchRadius">
											Search Radius
										</FieldLabel>
										<FieldDescription className="max-w-md">
											Control how far the app checks for places when you perform
											a search. Increasing this may yield more but potentially
											inaccurate results.
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</FieldDescription>
									</FieldContent>

									<Select
										name={field.name}
										value={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger
											id="searchRadius"
											aria-invalid={fieldState.invalid}
											className="min-w-32"
										>
											<SelectValue placeholder="Radius" />
										</SelectTrigger>
										<SelectContent position="popper" align="end">
											{searchRadiusOptions.map(({ key, label }) => (
												<SelectItem key={key} value={key}>
													{label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						<Controller
							name="enableSearchHistory"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									orientation="horizontal"
								>
									<FieldContent>
										<FieldLabel htmlFor="enableSearchHistory">
											Enable Search History
										</FieldLabel>
										<FieldDescription className="max-w-md">
											Enable or disable search history. When enabled, your
											previous search queries will be saved locally.
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</FieldDescription>
									</FieldContent>

									<Switch
										id="enableSearchHistory"
										name={field.name}
										checked={field.value}
										onCheckedChange={field.onChange}
										aria-invalid={fieldState.invalid}
									/>
								</Field>
							)}
						/>

						<Controller
							name="enableRecentViews"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									orientation="horizontal"
								>
									<FieldContent>
										<FieldLabel htmlFor="enableRecentViews">
											Enable Recent Views
										</FieldLabel>
										<FieldDescription className="max-w-md">
											Enable or disable recent views. When enabled, your
											previously viewed items will be saved locally.
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</FieldDescription>
									</FieldContent>

									<Switch
										id="enableRecentViews"
										name={field.name}
										checked={field.value}
										onCheckedChange={field.onChange}
										aria-invalid={fieldState.invalid}
									/>
								</Field>
							)}
						/>
					</FieldGroup>
				</FieldSet>

				<Button
					type="submit"
					form="preferences-form"
					variant="default"
					className="ml-auto w-full max-w-xs"
				>
					Save Preferences
				</Button>
			</FieldSet>
		</form>
	);
}
