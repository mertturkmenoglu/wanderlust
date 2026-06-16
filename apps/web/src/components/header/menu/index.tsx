import { Button } from '@wanderlust/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import { UserIcon } from 'lucide-react';
import { authClient } from '@/lib/auth';
import { Content } from './content';
import { useShortName } from './hooks';

export function Menu() {
	const session = authClient.useSession();
	const user = session.data?.user;
	const firstName = user?.name.split(' ')[0] ?? 'You';
	const shortName = useShortName(firstName, 20);

	if (!user) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="rounded-full" variant="ghost">
					<UserIcon className="size-5 text-black" />
					<span className="sr-only">Menu</span>
					<span className="hidden sm:block">{shortName}</span>
				</Button>
			</DropdownMenuTrigger>
			<Content fullName={user.name} username={user.username} />
		</DropdownMenu>
	);
}
