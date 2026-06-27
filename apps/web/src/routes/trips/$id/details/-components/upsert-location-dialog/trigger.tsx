import { Button } from '@wanderlust/ui/components/button';
import { MapPinPlusIcon, Settings2Icon } from 'lucide-react';
import { useUpsertLocationDialogContext } from './context';
import { useOpenDialog } from './hooks';

export function Trigger() {
	const ctx = useUpsertLocationDialogContext();

	const openDialog = useOpenDialog();

	if (ctx.update || ctx.onOpen) {
		return (
			<Button variant="ghost" size="icon" onClick={() => openDialog()}>
				<Settings2Icon />
			</Button>
		);
	}

	return (
		<Button
			variant="secondary"
			size="sm"
			className="ml-auto"
			onClick={() => {
				openDialog();
			}}
		>
			<MapPinPlusIcon />
			<span>Add Location</span>
		</Button>
	);
}
