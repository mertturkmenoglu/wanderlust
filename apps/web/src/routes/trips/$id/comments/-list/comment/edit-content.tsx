import { Button } from '@wanderlust/ui/components/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupTextarea,
} from '@wanderlust/ui/components/input-group';
import { ItemContent } from '@wanderlust/ui/components/item';
import { useState } from 'react';
import { useCommentContext } from './context';
import { useUpdateCommentMutation } from './hooks';

export function EditContent() {
	const ctx = useCommentContext();
	const [value, setValue] = useState(ctx.comment.content);
	const mutation = useUpdateCommentMutation();

	const reset = () => {
		setValue(ctx.comment.content);
		ctx.setIsEditMode(false);
	};

	const onEdit = () => {
		mutation.mutate(
			{
				commentId: ctx.comment.id,
				id: ctx.comment.tripId,
				content: value,
			},
			{
				onSuccess: () => {
					reset();
				},
			},
		);
	};

	return (
		<ItemContent>
			<InputGroup>
				<InputGroupTextarea
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder="Add your comment here..."
					autoComplete="off"
					rows={4}
					className="max-h-32"
				/>

				<InputGroupAddon align="block-end" className="flex flex-row">
					<Button
						type="button"
						variant="secondary"
						className="ml-auto"
						onClick={reset}
					>
						Cancel
					</Button>

					<Button type="button" variant="default" onClick={onEdit}>
						Edit
					</Button>
				</InputGroupAddon>
			</InputGroup>
		</ItemContent>
	);
}
