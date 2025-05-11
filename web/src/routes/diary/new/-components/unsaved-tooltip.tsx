import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TriangleAlertIcon } from 'lucide-react';

export default function UnsavedChanges() {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            <TriangleAlertIcon className="size-4 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              You have unsaved changes.
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={12}>
          <div className="">You have unsaved changes.</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
