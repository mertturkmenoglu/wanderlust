import { useNavigate } from '@tanstack/react-router';
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	DialogPortal,
} from '@wanderlust/ui/components/dialog';
import { ScrollArea } from '@wanderlust/ui/components/scroll-area';
import { useState } from 'react';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useOnEmit } from '@/hooks/use-on-emit';
import type { DataResource, ResourceKey } from '@/lib/crud';
import { upsertEmitter } from '@/lib/events';

type Props<TKey extends ResourceKey, TOne> = Omit<
	React.ComponentProps<typeof Dialog>,
	'children'
> & {
	id: string;
	children: React.ReactNode;
	resource: DataResource<TKey, TOne>;
};

export function EditDialog<TKey extends ResourceKey, TOne>({
	id,
	children,
	resource,
	...props
}: Props<TKey, TOne>) {
	const navigate = useNavigate();
	const [open] = useState(true);
	const [dirty, setDirty] = useState(false);
	const confirm = useConfirmDialog();

	useOnEmit(upsertEmitter, 'isDirty', (data) => {
		setDirty(data);
	});

	const close = async () => {
		if (dirty) {
			const ok = await confirm.confirm({
				title: 'Unsaved Changes',
				description:
					'You have unsaved changes. Are you sure you want to leave?',
				confirmText: 'Leave',
				cancelText: 'Stay',
				variant: 'destructive',
			});

			if (!ok) {
				return;
			}
		}

		await navigate(resource.links.details(id));
	};

	return (
		<Dialog open={open} {...props} onOpenChange={(o) => !o && close()}>
			<DialogPortal className="w-full">
				<DialogOverlay className="fixed inset-0 z-50 w-full" />
				<DialogContent className="flex h-[70vh]! w-[70vw]! max-w-full! flex-col rounded-lg">
					<div className="min-h-0 flex-1 pt-4">
						{confirm.Dialog}

						<ScrollArea className="h-full pr-8">
							<div className="pb-8">{children}</div>
						</ScrollArea>
					</div>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
