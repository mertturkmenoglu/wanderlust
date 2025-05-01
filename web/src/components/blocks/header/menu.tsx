import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { components } from '@/lib/api-types';
import { UserIcon } from 'lucide-react';
import MenuContent from './menu-content';

type Props = {
  auth: components['schemas']['GetMeOutputBody'];
};

export default function Menu({ auth }: Readonly<Props>) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" variant="ghost">
            <UserIcon className="size-5 text-black" />
            <span className="sr-only">Menu</span>
            <span className="hidden sm:ml-2 sm:block">{auth.fullName}</span>
          </Button>
        </DropdownMenuTrigger>
        <MenuContent fullName={auth.fullName} username={auth.username} />
      </DropdownMenu>
    </div>
  );
}
