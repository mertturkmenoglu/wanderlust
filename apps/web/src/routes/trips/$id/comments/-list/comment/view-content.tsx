import { ItemContent } from '@wanderlust/ui/components/item';
import { useCommentContext } from './context';

export function ViewContent() {
	const ctx = useCommentContext();

	return (
		<ItemContent>
			<div>{ctx.comment.content}</div>
		</ItemContent>
	);
}
