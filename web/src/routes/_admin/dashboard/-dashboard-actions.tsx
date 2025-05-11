import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { ChevronRightIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function DashboardActions({ children }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="secondary" className="w-full justify-start">
          {open ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
          <span className="">Actions</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        {children}
        <Separator className="mt-2" />
      </CollapsibleContent>
    </Collapsible>
  );
}
