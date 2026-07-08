import { Outlet, useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { KeyValueList } from '@wanderlust/ui/components/key-value-list';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@wanderlust/ui/components/resizable';
import { cn } from '@wanderlust/ui/lib/utils';
import {
	MoveUpRightIcon,
	RefreshCwIcon,
	Settings2Icon,
	Share2Icon,
	Trash2Icon,
} from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
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
	const previewRef = useRef<HTMLIFrameElement>(null);

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
							<Settings2Icon />
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
							<MoveUpRightIcon />
							Visit
						</Button>
						<Button
							variant="outline"
							onClick={async () => {
								const link = props.resource.extractors.appLink(props.data);
								await copyToClipboard(link ?? window.location.toString());
							}}
						>
							<Share2Icon />
							Share
						</Button>
						<Button
							variant="outline"
							disabled={!props.resource.enablePreview}
							onClick={async () => {
								if (!previewRef.current) {
									toast.error('Preview not available');
									return;
								}

								// biome-ignore lint/correctness/noSelfAssign: This is is intentional to force the iframe to reload.
								previewRef.current.src = previewRef.current.src;
							}}
						>
							<RefreshCwIcon />
							{!props.resource.enablePreview
								? 'Preview Disabled'
								: 'Refresh Preview'}
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
						<Trash2Icon />
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
						<ResizablePanel
							defaultSize={props.resource.enablePreview ? '60%' : '90%'}
							minSize={props.resource.enablePreview ? '25%' : '10%'}
							maxSize={props.resource.enablePreview ? '75%' : '90%'}
						>
							<KeyValueList
								variant="bordered"
								items={props.rows.map((r) => ({ label: r[0], value: r[1] }))}
							/>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel
							defaultSize={props.resource.enablePreview ? '40%' : '10%'}
							minSize={props.resource.enablePreview ? '25%' : '10%'}
							maxSize={props.resource.enablePreview ? '75%' : '10%'}
						>
							{props.resource.enablePreview ? (
								<iframe
									id="preview"
									ref={previewRef}
									title="Content Preview"
									className="h-full w-full"
									src={props.resource.extractors.appLink(props.data)}
								/>
							) : (
								<div className="m-4 flex items-center justify-center text-center text-xs">
									<div>
										Preview is not available for this resource. You can enable
										it by calling <code>setPreviewEnabled(true)</code> when
										building the resource.
									</div>
								</div>
							)}
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>

			<Outlet />
		</Container>
	);
}
