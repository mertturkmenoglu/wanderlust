import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { Grid2X2Icon, TextAlignJustifyIcon } from 'lucide-react';
import { useListContext } from './-context';

export function ChangeView() {
	const ctx = useListContext();

	return (
		<ButtonGroup className="ml-auto">
			<Button
				onClick={() => ctx.setView('list')}
				variant={ctx.view === 'list' ? 'default' : 'outline'}
			>
				<TextAlignJustifyIcon />
				<span>List</span>
			</Button>
			<Button
				onClick={() => ctx.setView('grid')}
				variant={ctx.view === 'grid' ? 'default' : 'outline'}
			>
				<Grid2X2Icon />
				<span>Grid</span>
			</Button>
		</ButtonGroup>
	);
}
