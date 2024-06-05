'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareButton() {
  async function handleClick() {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={handleClick}
          >
            <Share2 className="size-6 text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Copy link to your clipboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
