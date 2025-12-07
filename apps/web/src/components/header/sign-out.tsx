import { useMutation } from '@tanstack/react-query';
import { DropdownMenuItem } from '@wanderlust/ui/components/dropdown-menu';
import { LogOutIcon } from 'lucide-react';
import { authClient } from '@/lib/auth';

export function SignOut() {
	const mutation = useMutation({
		mutationKey: ['sign-out'],
		mutationFn: async () => {
			await authClient.signOut({
				fetchOptions: {
					throw: true,
				},
			});
		},
		onSuccess: () => {
			globalThis.window.location.href = '/';
		},
	});

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
