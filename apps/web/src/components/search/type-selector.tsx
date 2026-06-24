import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { cn } from '@wanderlust/ui/lib/utils';
import { Building2Icon, MapPinIcon, UserIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchType } from '@/hooks/use-search-type';

type Props = {
	className?: string;
};

export function TypeSelector({ className }: Props) {
	const [searchType, setSearchType] = useSearchType();
	const isMobile = useIsMobile();

	return (
		<ButtonGroup className={cn(className)}>
			<Button
				variant={searchType === 'places' ? 'default' : 'outline'}
				size={isMobile ? 'default' : 'xl'}
				className="rounded-l-full"
				onClick={() => setSearchType('places')}
			>
				<MapPinIcon />
				Places
			</Button>

			<Button
				variant={searchType === 'cities' ? 'default' : 'outline'}
				size={isMobile ? 'default' : 'xl'}
				onClick={() => setSearchType('cities')}
			>
				<Building2Icon />
				Cities
			</Button>

			<Button
				variant={searchType === 'users' ? 'default' : 'outline'}
				size={isMobile ? 'default' : 'xl'}
				className="rounded-r-full"
				onClick={() => setSearchType('users')}
			>
				<UserIcon />
				Users
			</Button>
		</ButtonGroup>
	);
}
