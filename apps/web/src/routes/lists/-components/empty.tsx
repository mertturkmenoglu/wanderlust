import { useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CreateListDialog } from '@/components/lists/create-list-dialog';
import { useInvalidator } from '@/hooks/use-invalidator';

export function EmptyState() {
	const navigate = useNavigate();
	const invalidate = useInvalidator();
	const [open, setOpen] = useState(false);

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<img
						src="/logo.png"
						alt=""
						className="size-24 min-h-24 min-w-24 grayscale"
					/>
				</EmptyMedia>
				<EmptyTitle>No lists found</EmptyTitle>
				<EmptyDescription>
					You haven't created any lists yet. Start by creating one!
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<CreateListDialog
					open={open}
					setOpen={setOpen}
					onSuccess={async (res) => {
						toast.success('List created');
						await invalidate();
						await navigate({
							to: '/lists/$id',
							params: {
								id: res.list.id,
							},
						});
					}}
				>
					<Button variant="default" className="space-x-2">
						<PlusIcon className="size-4" />
						<span>New List</span>
					</Button>
				</CreateListDialog>
			</EmptyContent>
		</Empty>
	);
}
