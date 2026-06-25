import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { Content } from './content';
import { CommentListContextProvider } from './context';
import type { CommentListProps } from './types';

export function CommentList(props: CommentListProps) {
	return (
		<CommentListContextProvider>
			<SuspenseWrapper>
				<Content {...props} />
			</SuspenseWrapper>
		</CommentListContextProvider>
	);
}
