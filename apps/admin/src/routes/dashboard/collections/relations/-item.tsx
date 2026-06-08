import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { ArrowRightIcon, TrashIcon } from 'lucide-react';

type Props = {
	title: string;
	description: React.ReactNode;
	onDelete: () => Promise<void>;
};

export function RelationItem({ title, description, onDelete }: Props) {
	return (
		<Item variant="outline">
			<ItemMedia variant="icon">
				<ArrowRightIcon className="size-4" />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{title}</ItemTitle>
				<ItemDescription>{description}</ItemDescription>
			</ItemContent>
			<ItemActions>
				<Button
					variant="destructive"
					size="icon"
					className="mt-2"
					onClick={onDelete}
				>
					<TrashIcon className="size-4" />
					<span className="sr-only">Remove relation</span>
				</Button>
			</ItemActions>
		</Item>
	);
}
