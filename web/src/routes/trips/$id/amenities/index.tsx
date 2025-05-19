import { Button } from '@/components/ui/button';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { Settings2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { EditAmenities } from './-edit';
import { ViewAmenities } from './-view';

export const Route = createFileRoute('/trips/$id/amenities/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/trips/$id');
  const { trip } = route.useLoaderData();
  const { auth } = route.useRouteContext();
  const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-medium">Requested Amenities</div>
        {isPrivileged && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? (
              <XIcon className="mr-2 size-4" />
            ) : (
              <Settings2Icon className="mr-2 size-4" />
            )}
            <span>{isEditMode ? 'Cancel' : 'Edit'}</span>
          </Button>
        )}
      </div>
      {isEditMode ? <EditAmenities /> : <ViewAmenities />}
    </div>
  );
}
