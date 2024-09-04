'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Auth } from '@/lib/auth';
import { UserIcon } from 'lucide-react';
import MenuContent from './menu-content';

type Props = {
  auth: Auth;
};

export default function Menu({ auth }: Readonly<Props>) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-full"
            variant="ghost"
          >
            <UserIcon className="size-5 text-black" />
            <span className="hidden sm:ml-2 sm:block">
              {auth.data.fullName}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <MenuContent
          fullName={auth.data.fullName}
          username={auth.data.username}
        />
      </DropdownMenu>
    </div>
  );
}
