import { Content } from './content';
import { CommentContextProvider } from './context';
import type { CommentProps } from './types';

export function Comment(props: CommentProps) {
	return (
		<CommentContextProvider {...props}>
			<Content {...props} />
		</CommentContextProvider>
	);
}
