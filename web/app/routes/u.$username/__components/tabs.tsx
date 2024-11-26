import { Link, useMatches } from "react-router";
import { buttonVariants } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

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
    { id: "routes/u.$username/route", label: "Profile", href: `${base}` },
    {
      id: "routes/u.$username/activities/route",
      label: "Activities",
      href: `${base}/activities`,
    },
    {
      id: "routes/u.$username/reviews/route",
      label: "Reviews",
      href: `${base}/reviews`,
    },
    {
      id: "routes/u.$username/lists/route",
      label: "Lists",
      href: `${base}/lists`,
    },
    {
      id: "routes/u.$username/favorites/route",
      label: "Favorites",
      href: `${base}/favorites`,
    },
  ];

  const activeTab = tabs.find((tab) => tab.id === lastMatch.id);

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
                    variant: activeTab?.id === t.id ? "default" : "ghost",
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
