'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useAuth } from '@clerk/nextjs';

function LogoutItem(): React.ReactElement {
  const { signOut } = useAuth();

  return (
    <DropdownMenuItem
      className="hover:cursor-pointer"
      onClick={async (e) => {
        e.preventDefault();
        await signOut();
      }}
    >
      Log out
    </DropdownMenuItem>
  );
}

export default LogoutItem;
