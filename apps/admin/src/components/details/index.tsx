import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';

export type ObjectDetailsProps = Omit<
	React.ComponentPropsWithoutRef<'div'>,
	'className'
> & {
	object: {
		type: string;
		title: string;
		id: string;
		description?: string;
	};
	classNames?: Partial<{
		root: string;
	}>;
	onEdit?: () => void | Promise<void>;
	onDelete?: () => void | Promise<void>;
	onVisit?: () => void | Promise<void>;
	onShare?: () => void | Promise<void>;
};

export function ObjectDetails({
	classNames,
	object,
	onEdit,
	onDelete,
	onVisit,
	onShare,
	children,
	...props
}: ObjectDetailsProps) {
	return (
		<div
			className={cn('rounded-xl border border-border p-8', classNames?.root)}
			{...props}
		>
			{/* Header */}
			<div className="flex flex-row items-center justify-between gap-4">
				<div>
					<div className="text-primary capitalize">{object.type}</div>
					<div className="mt-2 text-4xl">{object.title}</div>
					<div className="text-muted-foreground text-sm">ID: {object.id}</div>
				</div>

				<div className="flex flex-row items-center gap-2">
					<ButtonGroup>
						<Button variant="midnight" onClick={onEdit}>
							Edit
						</Button>
						<Button variant="outline" onClick={onVisit}>
							Visit
						</Button>
						<Button variant="outline" onClick={onShare}>
							Share
						</Button>
					</ButtonGroup>

					<Button variant="destructive" onClick={onDelete}>
						Delete
					</Button>
				</div>
			</div>

			<div className="mt-4 text-muted-foreground text-sm">
				{object.description ?? 'No description available.'}
			</div>

			<Separator className="my-8" />

			<div className="flex flex-col gap-2">
				{/* Content */}
				{children}
			</div>
		</div>
	);
}
