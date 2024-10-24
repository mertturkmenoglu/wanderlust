import { TriangleAlertIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function UnsavedChanges() {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger>
          <>
            <TriangleAlertIcon className="size-4 mx-4 text-yellow-400" />
            <span className="sr-only">You have unsaved changes.</span>
          </>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={12}>
          <div className="">You have unsaved changes.</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
