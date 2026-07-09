import type {
	SuggestionKeyDownProps,
	SuggestionProps,
} from '@tiptap/suggestion';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import type { Outputs } from '@/lib/orpc';
import { UserImage } from '../user-image';

export interface MentionListRef {
	onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

type User = Outputs['users']['searchFollowing']['friends'][number];

export const MentionList = React.forwardRef<
	MentionListRef,
	SuggestionProps<User>
>(function MentionListImpl({ items, command }, ref) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const selectItem = (index: number) => {
		const item = items[index];

		if (item) {
			command({ id: item.username });
		}
	};

	const upHandler = () => {
		setSelectedIndex((selectedIndex + items.length - 1) % items.length);
	};

	const downHandler = () => {
		setSelectedIndex((selectedIndex + 1) % items.length);
	};

	const enterHandler = () => {
		selectItem(selectedIndex);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional
	useEffect(() => setSelectedIndex(0), [items]);

	useImperativeHandle(ref, () => ({
		onKeyDown: ({ event }) => {
			if (event.key === 'ArrowUp') {
				upHandler();
				return true;
			}

			if (event.key === 'ArrowDown') {
				downHandler();
				return true;
			}

			if (
				event.key === 'Enter' ||
				event.key === 'Tab' ||
				event.key === 'Space'
			) {
				enterHandler();
				return true;
			}

			return false;
		},
	}));

	return (
		<div className="items flex min-w-64 flex-col rounded-md border border-border bg-background">
			<ItemGroup className="gap-0!">
				{items.length > 0 ? (
					items.map((item, index) => {
						const isSelected = selectedIndex === index;

						return (
							<Item
								variant="default"
								size="xs"
								key={item.username}
								onClick={() => {
									selectItem(index);
								}}
								onMouseOver={() => {
									setSelectedIndex(index);
								}}
								className={cn('flex cursor-pointer rounded-none', {
									'bg-muted': isSelected,
								})}
							>
								<ItemMedia>
									<UserImage src={item.image} className="size-8" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>{item.name}</ItemTitle>
									<ItemDescription className="text-primary">
										@{item.username}
									</ItemDescription>
								</ItemContent>
							</Item>
						);
					})
				) : (
					<div className="p-2 text-muted-foreground text-xs">No result</div>
				)}
			</ItemGroup>
		</div>
	);
});
