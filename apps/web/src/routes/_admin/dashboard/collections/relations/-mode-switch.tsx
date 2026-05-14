import { getRouteApi } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';

export function ModeSwitch() {
	const route = getRouteApi('/_admin/dashboard/collections/relations/');
	const { mode } = route.useSearch();
	const navigate = route.useNavigate();

	return (
		<ButtonGroup>
			<Button
				variant={mode === 'place' ? 'default' : 'outline'}
				size="sm"
				onClick={() => navigate({ search: { mode: 'place' } })}
			>
				Places
			</Button>
			<Button
				variant={mode === 'city' ? 'default' : 'outline'}
				size="sm"
				onClick={() => navigate({ search: { mode: 'city' } })}
			>
				Cities
			</Button>
		</ButtonGroup>
	);
}
