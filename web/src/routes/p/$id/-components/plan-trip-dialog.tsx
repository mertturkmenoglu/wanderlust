import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/providers/auth-provider';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { MapIcon, PlusIcon, XIcon } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

type Props = {
  className?: string;
};

export function PlanTripDialog({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (open && !auth.user) {
      navigate({
        to: '/sign-in',
      });
    }
  }, [open, auth.user]);

  const [state, setState] = useState<'choose' | 'new-trip' | 'add-to-trip'>(
    'choose',
  );

  const query = api.useQuery(
    'get',
    '/api/v2/trips/',
    {},
    { enabled: !!auth.user && open },
  );

  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        setState('choose');
        setOpen(o);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          size="lg"
          className="mt-4 w-full md:w-2/3 mx-auto"
          onClick={() => setOpen(true)}
        >
          <MapIcon className="size-5" />
          <span className="text-base">Plan a trip</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn(className)}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between gap-2">
            <span>Plan a Trip to {poi.name}</span>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              <XIcon className="size-4 text-muted-foreground" />
            </Button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="grid grid-cols-2 gap-4">
          {state === 'choose' && (
            <>
              <button
                className={cn(
                  'flex flex-col gap-4 items-center justify-center p-4 bg-muted aspect-square rounded-md',
                  'font-medium',
                  'transition-all duration-300 ease-in-out hover:bg-primary hover:text-white group',
                )}
                onClick={() => {
                  navigate({
                    to: '/trips',
                    search: () => ({ showNewDialog: true }),
                  });
                }}
              >
                <PlusIcon className="size-6 text-primary group-hover:text-white" />
                <span>New Trip</span>
              </button>

              <button
                className={cn(
                  'flex flex-col gap-4 items-center justify-center p-4 bg-muted aspect-square rounded-md',
                  'font-medium',
                  'transition-all duration-300 ease-in-out hover:bg-primary hover:text-white group',
                )}
                onClick={() => setState('add-to-trip')}
              >
                <MapIcon className="size-6 text-primary group-hover:text-white" />
                <span>Add to Existing Trip</span>
              </button>
            </>
          )}
          {state === 'add-to-trip' && (
            <ScrollArea className="h-96 pr-2 col-span-full">
              {query.data?.trips
                .filter(
                  (trip) =>
                    trip.ownerId === auth.user?.id ||
                    trip.participants.some(
                      (p) => p.id === auth.user?.id && p.role === 'editor',
                    ),
                )
                .map((trip) => (
                  <button
                    className="p-2 hover:bg-primary/10 w-full flex justify-start items-center"
                    onClick={() => {
                      navigate({
                        to: '/trips/$id',
                        params: {
                          id: trip.id,
                        },
                        search: () => ({
                          isUpdate: false,
                          poiId: poi.id,
                          showLocationDialog: true,
                          description: `Trip to ${poi.name}`,
                        }),
                      });
                    }}
                  >
                    {trip.title}
                  </button>
                ))}
              <ScrollBar />
            </ScrollArea>
          )}
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
