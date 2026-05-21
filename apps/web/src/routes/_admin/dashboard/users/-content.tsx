import { useLoaderData, useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Input } from '@wanderlust/ui/components/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { formatDistanceToNow } from 'date-fns';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { usersCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';
import { Pagination } from '@/components/pagination';

export function Content() {
	const a = useLoaderData({ from: '/_admin/dashboard/users/' });
	const search = useSearch({ from: '/_admin/dashboard/users/' });
	const navigate = useNavigate({ from: '/dashboard/users/' });

	const page = search.page ?? 1;
	const pageSize = search.pageSize ?? 20;
	const [searchValue, setSearchValue] = useState(search.search ?? '');
	const [searchBy, setSearchBy] = useState(search.searchBy ?? 'email');

	if (!a) return null;

	if (!a.data) return null;

	if (!a.data.users) return null;

	return (
		<div className="flex flex-col">
			<div className="flex flex-row items-start gap-4">
				<Select
					value={searchBy}
					onValueChange={(v) => setSearchBy(v === 'email' ? 'email' : 'name')}
				>
					<SelectTrigger className="md:w-45">
						<SelectValue placeholder="Search by" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="email">Email</SelectItem>
							<SelectItem value="name">Name</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<div className="flex-1">
					<Input
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								navigate({ search: { search: searchValue, searchBy } });
							}
						}}
						placeholder="Search users"
					/>
					<span className="line-clamp-1 text-muted-foreground text-xs">
						Search is case sensitive
					</span>
				</div>
				<Button
					onClick={() =>
						navigate({ search: { search: searchValue, searchBy } })
					}
				>
					Search
					<SearchIcon />
				</Button>
			</div>

			<DataTable
				columns={usersCols}
				// @ts-expect-error username is included in the data
				data={a.data.users.map((u) => ({
					...u,
					createdAt: formatDistanceToNow(u.createdAt, { addSuffix: true }),
					updatedAt: formatDistanceToNow(u.updatedAt, { addSuffix: true }),
				}))}
				filterColumnId="email"
				hrefPrefix="/dashboard/users"
			/>

			<div className="mt-2 ml-auto flex flex-row items-baseline text-muted-foreground text-sm">
				Showing{' '}
				<select
					className="ml-1 w-20 text-right"
					value={pageSize}
					onChange={(e) =>
						navigate({
							to: '.',
							search: { page: 1, pageSize: Number(e.target.value) },
						})
					}
				>
					<option value={20}>20</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
				</select>
				<span className="ml-1"> | Total {a.data.total}</span>
			</div>

			<Pagination
				className="mx-auto mt-4"
				hasPreviousPage={page > 1}
				page={page}
				hasNextPage={page * pageSize < a.data.total}
				onPrevClick={() =>
					navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							page: page - 1,
						}),
					})
				}
				onNextClick={() =>
					navigate({
						to: '.',
						search: (prev) => ({
							...prev,
							page: page + 1,
						}),
					})
				}
				totalPages={Math.ceil(a.data.total / pageSize)}
			/>
		</div>
	);
}
