import { DropdownMenuItem } from '@wanderlust/ui/components/dropdown-menu';
import { LogOutIcon } from 'lucide-react';
import { useSignOutMutation } from './hooks';

export function SignOut() {
	const mutation = useSignOutMutation();

	return (
		<DropdownMenuItem
			className="cursor-pointer gap-4"
			variant="destructive"
			onClick={() => {
				mutation.mutate();
			}}
		>
			<LogOutIcon />
			<span>Sign out</span>
		</DropdownMenuItem>
	);
}
