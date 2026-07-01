import { useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { copyToClipboard } from '@/lib/clipboard';
import type { DataResource, ProcIn, ResourceKey } from '@/lib/crud';
import { DetailRow, DetailTable } from '../details/table';

export type Props<K extends ResourceKey, T> = {
	resource: DataResource<K, T>;
	input: ProcIn<K, 'get'>;
	deleteInput: ProcIn<K, 'delete'>;
	rows: Array<[string, React.ReactNode]>;
};

export function Show<K extends ResourceKey, T>(props: Props<K, T>) {
	const navigate = useNavigate();
	const confirm = useConfirmDialog();
	const query = props.resource.useOne(props.input);

	const deleteMutation = props.resource.useDelete();

	if (query.isLoading) {
		return <div>Loading...</div>;
	}

	if (query.isError) {
		return <div>Error: {query.error.message}</div>;
	}

	const data = query.data;

	if (!data) {
		return <div>Not found</div>;
	}

	const obj = props.resource.extractors.one(data);

	return (
		<div className={cn('rounded-xl border border-border p-8')}>
			{confirm.Dialog}

			{/* Header */}
			<div className="flex flex-row items-center justify-between gap-4">
				<div>
					<div className="text-primary capitalize">
						{props.resource.resource}
					</div>
					<div className="mt-2 text-4xl">
						{props.resource.extractors.title(obj) ?? '-'}
					</div>
					<div className="text-muted-foreground text-sm">
						ID: {props.resource.extractors.id(obj) ?? '-'}
					</div>
				</div>

				<div className="flex flex-row items-center gap-2">
					<ButtonGroup>
						<Button
							variant="midnight"
							onClick={async () => {
								await navigate({
									to: props.resource.links.edit(props.resource.extractors.id(obj) ?? '')
										.to,
								});
							}}
						>
							Edit
						</Button>
						<Button
							variant="outline"
							onClick={async () => {
								await navigate({
									href: props.resource.extractors.appLink(obj),
								});
							}}
						>
							Visit
						</Button>
						<Button
							variant="outline"
							onClick={async () => {
								const link = props.resource.extractors.appLink(obj);
								await copyToClipboard(link ?? window.location.toString());
							}}
						>
							Share
						</Button>
					</ButtonGroup>

					<Button
						variant="destructive"
						onClick={async () => {
							const ok = await confirm.confirm({
								variant: 'destructive',
								title: 'Delete Item',
								description: `Are you sure you want to delete this ${props.resource.resource} item? This action cannot be undone.`,
								cancelText: 'Cancel',
								confirmText: 'Delete',
							});

							if (!ok) {
								return;
							}

							deleteMutation.mutate(props.deleteInput);
						}}
					>
						Delete
					</Button>
				</div>
			</div>

			<div className="mt-4 text-muted-foreground text-sm">
				{props.resource.extractors.description(obj) ?? 'No description available.'}
			</div>

			<Separator className="my-8" />

			<div className="flex flex-col gap-2">
				<DetailTable>
					{props.rows.map(([label, value]) => (
						<DetailRow key={label} label={label} value={value} />
					))}
				</DetailTable>
			</div>
		</div>
	);
}
