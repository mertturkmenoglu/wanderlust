'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  username: string;
  className?: string;
};

export default function Tabs({ username, className }: Props) {
  const pathname = usePathname();
  const base = `/user/${username}`;
  const tabs = [
    { label: 'Profile', href: `${base}` },
    { label: 'Activity', href: `${base}/activity` },
    { label: 'Reviews', href: `${base}/reviews` },
    { label: 'Diary', href: `${base}/diary` },
    { label: 'Lists', href: `${base}/lists` },
    { label: 'Favorites', href: `${base}/favorites` },
  ];

  const activeTab = tabs.find((tab) => pathname === tab.href);

  return (
    <div className={cn('mx-auto md:max-w-4xl', className)}>
      <ScrollArea>
        <ul className="mx-auto my-4 flex gap-2">
          {tabs.map((tab) => (
            <li key={tab.label}>
              <Button
                asChild
                variant={activeTab === tab ? 'default' : 'ghost'}
              >
                <Link
                  href={tab.href}
                  className={cn('', {
                    '': activeTab === tab,
                  })}
                >
                  {tab.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
