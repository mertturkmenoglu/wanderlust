"use client";

import { useMatches, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
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
  const navigate = useNavigate();

  return (
    <div className={cn(className)}>
      <ScrollArea>
        <Tabs
          value={activeTab?.id}
          onValueChange={(v) => {
            const newTab = tabs.find((tab) => tab.id === v);
            navigate(newTab?.href ?? "#");
          }}
          className="w-full my-4 bg-transparent"
        >
          <TabsList className="bg-transparent">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="bg-transparent !shadow-none first-of-type:pl-0 px-1"
              >
                <Button
                  variant={activeTab?.id === t.id ? "default" : "ghost"}
                  className=""
                >
                  {t.label}
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
