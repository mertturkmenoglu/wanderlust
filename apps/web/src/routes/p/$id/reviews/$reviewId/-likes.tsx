import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { Item, ItemGroup, ItemTitle } from '@wanderlust/ui/components/item';
import { Separator } from '@wanderlust/ui/components/separator';
import { useState } from 'react';
import { Pagination } from '@/components/pagination';
import { UserImage } from '@/components/user-image';
import { orpc } from '@/lib/orpc';

export function Likes() {
	const [page, setPage] = useState(1);

	const params = useParams({ from: '/p/$id/reviews/$reviewId/' });

	const query = useSuspenseQuery(
		orpc.reviews.listLikes.queryOptions({
			input: {
				id: params.reviewId,
				page: page,
				pageSize: 10,
			},
		}),
	);

	const isEmpty = query.data.users.length === 0;

	if (isEmpty) {
		return null;
	}

	return (
		<div>
			<div className="text-lg">Likes</div>

			<Separator />

			<ItemGroup className="mt-4">
				{query.data.users.map((like) => (
					<Link
						to="/u/$username"
						params={{ username: like.username }}
						key={like.id}
					>
						<Item variant="outline" size="sm" className="hover:bg-muted">
							<UserImage src={like.image} />
							<ItemTitle>{like.name}</ItemTitle>
							<div className="text-primary text-sm">@{like.username}</div>
						</Item>
					</Link>
				))}
			</ItemGroup>

			<Pagination
				className="mx-auto mt-8"
				pagination={query.data.pagination}
				onPrevClick={() => {
					setPage((prev) => prev - 1);
				}}
				onNextClick={() => {
					setPage((prev) => prev + 1);
				}}
			/>
		</div>
	);
}
