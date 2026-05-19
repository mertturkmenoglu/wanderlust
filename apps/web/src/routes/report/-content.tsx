import { useSearch } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { Controller, useFormContext } from 'react-hook-form';
import { useReportContext } from './-context';
import { EmptyState } from './-empty';
import { type FormInput, reasons, useCreateReportMutation } from './-hooks';
import { SuccessState } from './-success';

export function Content() {
	const { id, type } = useSearch({ from: '/report/' });
	const mutation = useCreateReportMutation();
	const ctx = useReportContext();
	const form = useFormContext<FormInput>();

	if (id === '' || type === '') {
		return <EmptyState />;
	}

	if (ctx.submitted) {
		return <SuccessState />;
	}

	return (
		<div className="mx-auto my-16 max-w-xl">
			<form
				onSubmit={form.handleSubmit((data) => {
					mutation.mutate({
						description: data.description,
						resourceId: data.resourceId,
						resourceType: data.resourceType,
						reason: +data.reason,
					});
				})}
			>
				<FieldGroup className="gap-4">
					<FieldSet>
						<FieldLegend>Report Content</FieldLegend>
						<FieldDescription>
							Thank you for taking the time to report unwanted content on
							Wanderlust.
						</FieldDescription>
					</FieldSet>

					<Controller
						name="resourceId"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Resource ID</FieldLabel>
								<Input
									{...field}
									placeholder="Resource ID"
									type="text"
									disabled
									aria-invalid={fieldState.invalid}
								/>
								<FieldDescription>
									We filled this value for you.
								</FieldDescription>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="resourceType"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Resource Type</FieldLabel>
								<Input
									{...field}
									placeholder="Resource ID"
									type="text"
									className="capitalize"
									disabled
									aria-invalid={fieldState.invalid}
								/>
								<FieldDescription>
									We filled this value for you.
								</FieldDescription>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="reason"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Reason</FieldLabel>
								<Select
									name={field.name}
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										className="w-full"
										aria-invalid={fieldState.invalid}
									>
										<SelectValue placeholder="Select a reason" />
									</SelectTrigger>
									<SelectContent>
										{reasons.map((reason) => (
											<SelectItem key={reason.id} value={reason.id}>
												{reason.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="description"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Description</FieldLabel>
								<Textarea
									{...field}
									placeholder="Describe the issue"
									aria-invalid={fieldState.invalid}
								/>
								<FieldDescription>
									Add a description for your report.
								</FieldDescription>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Button type="submit" className="mt-4" disabled={mutation.isPending}>
						{mutation.isPending && <Spinner className="mx-auto size-4" />}
						Report
					</Button>
				</FieldGroup>
			</form>
		</div>
	);
}
