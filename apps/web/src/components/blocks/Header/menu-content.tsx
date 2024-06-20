'use client';

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import LogoutItem from './logout-item';

type Props = {
  fullName: string;
  username: string;
};

export default function MenuContent({ fullName, username }: Props) {
  return (
    <DropdownMenuContent
      className="w-56"
      align="end"
    >
      <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          asChild
          className="cursor-pointer"
        >
          <Link href={`/user/${username}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer"
        >
          <Link href="/notifications">Notifications</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer"
        >
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            href={`/user/${username}/following`}
            className="cursor-pointer"
          >
            Friends
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer"
        >
          <Link href="/bookmarks">Bookmarks</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer"
        >
          <Link href="/lists">My Lists</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer"
        >
          <Link href="/diary">Diary</Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>Support</DropdownMenuItem>
      <DropdownMenuItem
        asChild
        className="cursor-pointer"
      >
        <Link href="/privacy">Privacy</Link>
      </DropdownMenuItem>
      <DropdownMenuItem
        asChild
        className="cursor-pointer"
      >
        <Link href="/terms">Terms</Link>
      </DropdownMenuItem>
      <DropdownMenuItem disabled>API</DropdownMenuItem>
      <DropdownMenuSeparator />
      <LogoutItem />
    </DropdownMenuContent>
  );
}
