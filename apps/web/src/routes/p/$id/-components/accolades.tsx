import { Link, useLoaderData } from '@tanstack/react-router';
import { Badge } from '@wanderlust/ui/components/badge';
import { cn } from '@wanderlust/ui/lib/utils';
import { AwardIcon } from 'lucide-react';

type Props = {
	className?: string;
};

export function Accolades({ className }: Props) {
	const { place } = useLoaderData({ from: '/p/$id/' });

	if (place.accolades.length === 0) {
		return null;
	}

	return (
		<div className={cn('flex flex-wrap items-center gap-2', className)}>
			{place.accolades.map((acc) => (
				<Link
					key={acc.id}
					to="/accolades/$id"
					params={{
						id: acc.accolade.id,
					}}
					className="flex"
				>
					<Badge variant="warning" size="lg">
						<AwardIcon />
						{acc.accolade.title}
					</Badge>
				</Link>
			))}
		</div>
	);
}
