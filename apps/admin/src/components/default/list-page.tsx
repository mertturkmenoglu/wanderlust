import { Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import type { DataResource, ResourceKey } from '@/lib/crud';
import { Container } from '../container';
import { DenseList } from '../dense-list';

type Props<K extends ResourceKey, T> = {
	resource: DataResource<K, T>;
	render: (item: T) => React.ReactNode;
};

export function DefaultListPage<K extends ResourceKey, T>(props: Props<K, T>) {
	const query = props.resource.useList({});

	if (query.isLoading) {
		return <div>Loading...</div>;
	}

	if (query.isError) {
		return <div>Error: {query.error.message}</div>;
	}

	const data = query.data;

	if (!data) {
		return <div>No data found</div>;
	}

	const idExtractor = props.resource.extractors.id;

	return (
		<Container>
			<DenseList
				data={props.resource.extractors.list(data)}
				className="my-4"
				keyExtractor={idExtractor}
				renderItem={(item, className) => (
					<div className={cn(className)}>
						<Link {...props.resource.links.details(idExtractor(item))}>
							{props.render(item)}
						</Link>
					</div>
				)}
			/>
		</Container>
	);
}
