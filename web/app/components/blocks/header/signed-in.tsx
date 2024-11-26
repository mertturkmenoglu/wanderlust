import { Link } from "react-router";
import { BellIcon, SendIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function SignedInLinks() {
  return (
    <div className="flex items-center gap-2">
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
