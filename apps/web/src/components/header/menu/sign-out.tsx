import { DropdownMenuItem } from '@wanderlust/ui/components/dropdown-menu';
import { LogOutIcon } from 'lucide-react';
import { useSignOutMutation } from './hooks';

export function SignOut() {
	const mutation = useSignOutMutation();

	return (
		<DropdownMenuItem
			className="cursor-pointer gap-4 focus:bg-destructive/10 focus:text-destructive focus:[&>svg]:text-destructive"
			onClick={() => {
				mutation.mutate();
			}}
		>
			<LogOutIcon />
			<span>Sign out</span>
		</DropdownMenuItem>
	);
}
