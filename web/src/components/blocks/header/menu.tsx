import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { components } from '@/lib/api-types';
import { UserIcon } from 'lucide-react';
import MenuContent from './menu-content';
import { useShortName } from './use-short-name';

type Props = {
  auth: components['schemas']['GetMeOutputBody'];
};

export default function Menu({ auth }: Readonly<Props>) {
  const firstName = auth.fullName.split(' ')[0] ?? '';
  const shortName = useShortName(firstName, 20);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" variant="ghost">
            <UserIcon className="size-5 text-black" />
            <span className="sr-only">Menu</span>
            <span className="hidden sm:ml-2 sm:block">{shortName}</span>
          </Button>
        </DropdownMenuTrigger>
        <MenuContent fullName={auth.fullName} username={auth.username} />
      </DropdownMenu>
    </div>
  );
}
