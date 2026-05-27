import Markdown from 'react-markdown';
import { useCollectionQuery } from './-hooks';

export function Header() {
	const query = useCollectionQuery();
	const { collection } = query.data;

	return (
		<>
			<h2 className="text-2xl">{collection.name}</h2>
			<div className="prose mt-8">
				<Markdown>{collection.description}</Markdown>
			</div>
		</>
	);
}
