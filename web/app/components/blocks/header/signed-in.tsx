import { BellIcon, SearchIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ClientOnly } from "remix-utils/client-only";
import Search from "~/components/search";
import { CommandDialog } from "~/components/ui/command";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const hideSearchPaths = ["/", "/search"];

export default function SignedInLinks() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const showSearch = !hideSearchPaths.includes(location.pathname);

  return (
    <div className="flex items-center gap-2">
      {showSearch && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger tabIndex={-1} asChild>
              <button
                className="group inline-flex items-center justify-center rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-primary/10"
                onClick={() => setOpen(true)}
              >
                <SearchIcon className="size-5 transition-all duration-500 ease-in-out group-hover:text-primary" />
                <span className="sr-only">Search</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              <p>Search</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <ClientOnly
          fallback={
            <div className="">
              <Skeleton className="w-full h-10" />
            </div>
          }
        >
          {() => (
            <Search className="px-4" onItemClicked={() => setOpen(false)} />
          )}
        </ClientOnly>
      </CommandDialog>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger tabIndex={-1}>
            <Link
              to="/notifications"
              className="group inline-flex items-center justify-center rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-primary/10"
            >
              <BellIcon className="size-5 transition-all duration-500 ease-in-out group-hover:text-primary" />
              <span className="sr-only">Notifications</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger tabIndex={-1}>
            <Link
              to="/messages"
              className="group inline-flex items-center justify-center rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-primary/10"
            >
              <SendIcon className="size-5 transition-all duration-500 ease-in-out group-hover:text-primary" />
              <span className="sr-only">Messages</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            <p>Messages</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
