import { LogOutIcon } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { api } from '@/lib/api';

export function Logout() {
	const logoutMutation = api.useMutation('post', '/api/v2/auth/logout', {
		onSuccess: () => {
			globalThis.window.location.href = '/';
		},
	});

	return (
		<DropdownMenuItem
			className="group cursor-pointer focus:bg-destructive"
			onClick={() => {
				logoutMutation.mutate({});
			}}
		>
			<LogOutIcon className="size-4 group-focus:text-white" />
			<span className="ml-2 group-focus:text-white">Log out</span>
		</DropdownMenuItem>
	);
}
