'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import api from '@/lib/api';
import { useCallback } from 'react';

export default function Logout(): React.ReactElement {
  const logout = async () => {
    await api.post('auth/logout');
    window.location.reload();
  };

  const onClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    await logout();
  }, []);

  return (
    <DropdownMenuItem
      className="hover:cursor-pointer"
      onClick={onClick}
    >
      Log out
    </DropdownMenuItem>
  );
}
