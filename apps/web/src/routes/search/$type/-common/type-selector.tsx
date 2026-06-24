import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';

export function TypeSelector() {
	const { type } = useParams({ from: '/search/$type/' });
	const navigate = useNavigate({ from: '/search/$type/' });

	return (
		<ButtonGroup>
			<Button
				variant={type === 'places' ? 'default' : 'outline'}
				size="sm"
				onClick={() =>
					navigate({
						to: '.',
						params: { type: 'places' },
						search: (prev) => ({
							q: prev.q,
							page: 1,
							pageSize: prev.pageSize,
						}),
					})
				}
			>
				Places
			</Button>

			<Button
				variant={type === 'cities' ? 'default' : 'outline'}
				size="sm"
				onClick={() =>
					navigate({
						to: '.',
						params: { type: 'cities' },
						search: (prev) => ({
							q: prev.q,
							page: 1,
							pageSize: prev.pageSize,
						}),
					})
				}
			>
				Cities
			</Button>

			<Button
				variant={type === 'users' ? 'default' : 'outline'}
				size="sm"
				onClick={() =>
					navigate({
						to: '.',
						params: { type: 'users' },
						search: (prev) => ({
							q: prev.q,
							page: 1,
							pageSize: prev.pageSize,
						}),
					})
				}
			>
				Users
			</Button>
		</ButtonGroup>
	);
}
