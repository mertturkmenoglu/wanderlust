import { Item } from '@wanderlust/ui/components/item';
import { useCommentContext } from './context';
import { EditContent } from './edit-content';
import { Header } from './header';
import type { CommentProps } from './types';
import { ViewContent } from './view-content';

export function Content(_props: CommentProps) {
	const ctx = useCommentContext();

	return (
		<Item variant="outline" size="sm">
			<Header />

			{ctx.isEditMode ? <EditContent /> : <ViewContent />}
		</Item>
	);
}
