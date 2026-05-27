import { DropdownMenuItem } from '@wanderlust/ui/components/dropdown-menu';
import { LogOutIcon } from 'lucide-react';
import { useSignOutMutation } from './hooks';

export function SignOut() {
	const mutation = useSignOutMutation();

	return (
		<DropdownMenuItem
			className="group cursor-pointer focus:bg-destructive"
			onClick={() => {
				mutation.mutate();
			}}
		>
			<LogOutIcon className="size-4 group-focus:text-white" />
			<span className="ml-2 group-focus:text-white">Sign out</span>
		</DropdownMenuItem>
	);
}
