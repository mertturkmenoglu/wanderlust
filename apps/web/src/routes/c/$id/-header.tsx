import { cn } from '@wanderlust/ui/lib/utils';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCollectionQuery } from './-hooks';

export function Header() {
	const query = useCollectionQuery();
	const { collection } = query.data;

	return (
		<div
			className={cn(
				'prose prose-lg prose-hr:my-8 max-w-none',
				'prose-h2:mt-10 prose-h1:mb-2 prose-h2:mb-3',
				'prose-img:rounded-md prose-blockquote:border-slate-300 prose-h2:border-slate-200 prose-hr:border-slate-200 prose-h2:border-b',
				'prose-blockquote:border-l-4 prose-th:bg-slate-100 prose-h2:pb-2 prose-headings:font-bold',
				'prose-th:font-semibold prose-a:text-primary',
				'prose-blockquote:text-slate-500 prose-h1:text-4xl prose-h2:text-2xl',
				'prose-li:text-slate-600 prose-p:text-slate-600 prose-strong:text-slate-700',
				'prose-th:bg-transparent prose-table:text-sm',
				'prose-blockquote:italic prose-p:leading-relaxed prose-a:no-underline hover:prose-a:underline',
			)}
		>
			<h2>{collection.name}</h2>
			<Markdown remarkPlugins={[remarkGfm]}>{collection.description}</Markdown>
		</div>
	);
}
