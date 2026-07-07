import { Link, useNavigate } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { DataTable } from '@wanderlust/ui/components/data-table';
import { PlusIcon } from 'lucide-react';
import type { DataResource, ResourceKey } from '@/lib/crud';
import { toTitleCase } from '@/lib/text';
import { Container } from '../container';

type Props<K extends ResourceKey, T> = {
	resource: DataResource<K, T>;
	children?: React.ReactNode;
};

export function DefaultListPage<K extends ResourceKey, T>(props: Props<K, T>) {
	const query = props.resource.useList({});
	const navigate = useNavigate();
	const columns = props.resource.columns;

	if (query.isLoading) {
		return (
			<Container title={toTitleCase(props.resource.resource)}>
				Loading...
			</Container>
		);
	}

	if (query.isError) {
		return <div>Error: {query.error.message}</div>;
	}

	const data = query.data;

	if (!data) {
		return <div>No data found</div>;
	}

	return (
		<Container
			title={toTitleCase(props.resource.resource)}
			actions={
				<Link
					{...props.resource.links.new}
					className={buttonVariants({ variant: 'default' })}
				>
					<PlusIcon />
					<span>New {toTitleCase(props.resource.resource)}</span>
				</Link>
			}
		>
			<DataTable
				columns={columns}
				data={props.resource.extractors.list(data)}
				onRowClick={(row) => {
					navigate(
						props.resource.links.details(
							props.resource.extractors.id(row.original),
						),
					);
				}}
			/>

			{props.children}
		</Container>
	);
}
