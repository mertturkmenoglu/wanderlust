import { Link } from "@remix-run/react";
import { BellIcon, MapPinIcon, SendIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type Props = {
  city: string | null;
};

export default function SignedInLinks({ city }: Readonly<Props>) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger tabIndex={-1}>
            <Link
              to="/settings/location"
              className="group relative flex items-center justify-center gap-2 rounded-full bg-primary/10 p-2 transition-all duration-500 ease-in-out hover:bg-primary/20"
            >
              {city !== null && (
                <div className="hidden text-primary transition-all duration-500 ease-in-out sm:block">
                  {city}
                </div>
              )}
              <MapPinIcon className="size-5 text-primary transition-all duration-500 ease-in-out" />
              <div className="absolute right-0 top-0 size-2 animate-pulse rounded-full bg-primary"></div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            <p>Location</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger tabIndex={-1}>
            <Link
              to="/notifications"
              className="group inline-flex items-center justify-center rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-primary/10"
            >
              <BellIcon className="size-5 transition-all duration-500 ease-in-out group-hover:text-primary" />
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
