import { Button } from '@wanderlust/ui/components/button';
import {
	FieldDescription,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { cn } from '@wanderlust/ui/lib/utils';
import { FormProvider } from 'react-hook-form';
import { CreateTripForm } from './form';
import { useCreateTripForm, useCreateTripMutation } from './hooks';

type Props = {
	className?: string;
};

export function FormContent({ className }: Props) {
	const form = useCreateTripForm();
	const mutation = useCreateTripMutation();

	return (
		<FormProvider {...form}>
			<FieldSet className={cn(className)}>
				<FieldLegend className="text-2xl!">New Trip</FieldLegend>
				<FieldDescription>
					You can invite friends, add destinations and itinerary details for
					your trip after creating it.
				</FieldDescription>

				<FieldSeparator />

				<CreateTripForm />

				<Button
					type="submit"
					form="create-trip-form"
					className="w-full max-w-40 self-end"
					disabled={mutation.isPending}
				>
					{mutation.isPending && <Spinner />}
					<span>Create</span>
				</Button>
			</FieldSet>
		</FormProvider>
	);
}
