import {
	InputGroupAddon,
	InputGroupButton,
} from '@wanderlust/ui/components/input-group';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

type Props = {
	show: boolean;
	onShowChange: () => void;
};

export function PasswordShow(props: Props) {
	return (
		<InputGroupAddon align="inline-end">
			<InputGroupButton
				type="button"
				variant="ghost"
				size="icon-sm"
				onClick={props.onShowChange}
			>
				{props.show ? <EyeIcon /> : <EyeOffIcon />}
			</InputGroupButton>
		</InputGroupAddon>
	);
}
