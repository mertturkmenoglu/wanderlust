import { buttonVariants } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Link, useMatches } from '@tanstack/react-router';

type Props = {
  username: string;
  className?: string;
};

export default function UserTabs({ username, className }: Props) {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];

  if (!lastMatch) {
    return null;
  }

  const base = `/u/${username}`;
  const tabs = [
    { id: '/u/$username/', label: 'Profile', href: `${base}` },
    {
      id: '/u/$username/activities/',
      label: 'Activities',
      href: `${base}/activities`,
    },
    {
      id: '/u/$username/reviews/',
      label: 'Reviews',
      href: `${base}/reviews`,
    },
    {
      id: '/u/$username/lists/',
      label: 'Lists',
      href: `${base}/lists`,
    },
    {
      id: '/u/$username/favorites/',
      label: 'Favorites',
      href: `${base}/favorites`,
    },
  ];

  const activeTab = tabs.find((tab) => tab.id === lastMatch.routeId);

  return (
    <div className={cn(className)}>
      <ScrollArea>
        <Tabs value={activeTab?.id} className="w-full my-4 bg-transparent">
          <TabsList className="bg-transparent">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="bg-transparent !shadow-none first-of-type:pl-0 px-1"
              >
                <Link
                  to={t.href}
                  className={buttonVariants({
                    variant: activeTab?.id === t.id ? 'default' : 'ghost',
                  })}
                >
                  {t.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
