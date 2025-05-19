import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ReplyIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Content } from './content';

export function CommentsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-start">
          <ReplyIcon className="size-4" />
          <span>Comments</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="md:min-w-3xl min-h-[600px] flex flex-col justify-start">
        <AlertDialogHeader className="h-min">
          <AlertDialogTitle className="flex items-center gap-2">
            <ReplyIcon className="size-5 mr-2" />
            <span>Comments</span>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="ml-auto"
            >
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Content />
      </AlertDialogContent>
    </AlertDialog>
  );
}
