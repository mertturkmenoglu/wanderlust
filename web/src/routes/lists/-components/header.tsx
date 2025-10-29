import { CreateListDialog } from '@/components/blocks/lists/create-list-dialog';
import { Button } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  showNewListButton?: boolean;
};

export function Header({ showNewListButton = true }: Props) {
  const navigate = useNavigate();
  const invalidator = useInvalidator();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">My Lists</h2>
      {showNewListButton && (
        <CreateListDialog
          open={open}
          setOpen={setOpen}
          onSuccess={async (res) => {
            toast.success('List created');
            await invalidator.invalidate();
            await navigate({
              to: '/lists/$id',
              params: {
                id: res.list.id,
              },
            });
          }}
        >
          <Button
            variant="default"
            className="space-x-2"
          >
            <PlusIcon className="size-4" />
            <span>New List</span>
          </Button>
        </CreateListDialog>
      )}
    </div>
  );
}
