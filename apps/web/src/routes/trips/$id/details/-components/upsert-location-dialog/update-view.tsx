import { useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Label } from '@wanderlust/ui/components/label';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { ArrowLeftIcon } from 'lucide-react';
import { AppMessage } from '@/components/app-message';
import { PlaceCard } from '@/components/place-card';
import { TSTZPicker } from '@/components/tstz-picker';
import { useUpsertLocationDialogContext } from './context';
import { usePlaceQuery } from './hooks';

export function UpdateView() {
	const ctx = useUpsertLocationDialogContext();
	const navigate = useNavigate({ from: '/trips/$id/details/' });

	return (
		<div>
			{!ctx.update && (
				<Button
					variant="link"
					size="sm"
					className="px-0!"
					onClick={() => {
						navigate({
							to: '.',
							search: (prev) => ({ ...prev, placeId: undefined }),
						});
					}}
				>
					<ArrowLeftIcon />
					<span>Go back</span>
				</Button>
			)}

			<Inner />
		</div>
	);
}

function Inner() {
	const ctx = useUpsertLocationDialogContext();
	const query = usePlaceQuery();

	if (query.isLoading) {
		return (
			<div className="flex items-center justify-center">
				<Spinner className="mx-auto my-16 size-12" />
			</div>
		);
	}

	if (query.isError) {
		return (
			<AppMessage
				error="Failed to load place details"
				classNames={{ root: 'my-16' }}
			/>
		);
	}

	if (!query.data) {
		return (
			<AppMessage
				error="Place details not found"
				classNames={{ root: 'my-16' }}
			/>
		);
	}

	return (
		<>
			<PlaceCard place={query.data.place} className="mt-4" />

			<div className="mt-4">
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						placeholder="You can add a description for this location."
						value={ctx.description}
						className="mt-1"
						onChange={(e) => ctx.setDescription(e.target.value)}
					/>
				</div>

				<TSTZPicker
					value={ctx.scheduledTime}
					onChange={ctx.setScheduledTime}
					classNames={{
						root: 'mt-4',
					}}
					dateLabel="Scheduled Date"
					timeLabel="Time"
					// Meh
					fieldState={{
						invalid: false,
						isTouched: false,
						isDirty: false,
						isValidating: false,
					}}
					calendarProps={{}}
				/>
			</div>
		</>
	);
}
