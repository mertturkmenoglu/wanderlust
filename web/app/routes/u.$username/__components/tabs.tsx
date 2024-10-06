"use client";

import { Link, useMatches } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

type Props = {
  username: string;
  className?: string;
};

export default function Tabs({ username, className }: Props) {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];

  if (!lastMatch) {
    return null;
  }

  const base = `/u/${username}`;
  const tabs = [
    { id: "routes/u.$username", label: "Profile", href: `${base}` },
    {
      id: "routes/u.$username.activities",
      label: "Activities",
      href: `${base}/activities`,
    },
    {
      id: "routes/u.$username.reviews",
      label: "Reviews",
      href: `${base}/reviews`,
    },
    {
      id: "routes/u.$username.diary",
      label: "Diary",
      href: `${base}/diary`,
    },
    {
      id: "routes/u.$username.lists",
      label: "Lists",
      href: `${base}/lists`,
    },
    {
      id: "routes/u.$username.favorites",
      label: "Favorites",
      href: `${base}/favorites`,
    },
  ];

  const activeTab = tabs.find((tab) => tab.id === lastMatch.id);

  return (
    <div className={cn(className)}>
      <ScrollArea>
        <ul className="mx-auto my-4 flex gap-2">
          {tabs.map((tab) => (
            <li key={tab.label}>
              <Button asChild variant={activeTab === tab ? "default" : "ghost"}>
                <Link
                  to={tab.href}
                  className={cn("", {
                    "": activeTab === tab,
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
