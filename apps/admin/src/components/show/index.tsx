import { useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { KeyValueList } from '@wanderlust/ui/components/key-value-list';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@wanderlust/ui/components/resizable';
import { cn } from '@wanderlust/ui/lib/utils';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { copyToClipboard } from '@/lib/clipboard';
import type { DataResource, ProcIn, ResourceKey } from '@/lib/crud';
import { Container } from '../container';

export type Props<K extends ResourceKey, T> = {
	resource: DataResource<K, T>;
	input: ProcIn<K, 'get'>;
	deleteInput: ProcIn<K, 'delete'>;
	rows: Array<[string, React.ReactNode]>;
	data: T;
};

export function Show<K extends ResourceKey, T>(props: Props<K, T>) {
	const navigate = useNavigate();
	const confirm = useConfirmDialog();

	const deleteMutation = props.resource.useDelete();

	return (
		<Container
			title={
				props.resource.extractors.title(props.data) ??
				props.resource.extractors.id(props.data) ??
				'Details'
			}
			actions={
				<div className="flex flex-row items-center gap-2">
					<ButtonGroup>
						<Button
							variant="midnight"
							onClick={async () => {
								await navigate({
									to: props.resource.links.edit(
										props.resource.extractors.id(props.data) ?? '',
									).to,
								});
							}}
						>
							Edit
						</Button>
						<Button
							variant="outline"
							onClick={async () => {
								await navigate({
									href: props.resource.extractors.appLink(props.data),
								});
							}}
						>
							Visit
						</Button>
						<Button
							variant="outline"
							onClick={async () => {
								const link = props.resource.extractors.appLink(props.data);
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
			}
		>
			<div className={cn('py-4')}>
				{confirm.Dialog}

				<div className="flex flex-row gap-2">
					<ResizablePanelGroup
						orientation="horizontal"
						className="min-h-128 rounded-lg border"
					>
						<ResizablePanel defaultSize="60%" minSize="25%" maxSize="75%">
							<KeyValueList
								variant="bordered"
								items={props.rows.map((r) => ({ label: r[0], value: r[1] }))}
							/>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize="40%" minSize="25%" maxSize="75%">
							<iframe
								id="preview"
								title="Content Preview"
								className="h-full w-full"
								src={props.resource.extractors.appLink(props.data)}
							/>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>
		</Container>
	);
}
