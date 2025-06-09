import DashboardBreadcrumb from '@/components/blocks/dashboard/breadcrumb';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_admin/dashboard/exports/new/')({
  component: RouteComponent,
});

function RouteComponent() {
  const invalidator = useInvalidator();
  const navigate = useNavigate();
  const [idsText, setIdsText] = useState('');

  const createExportMutation = api.useMutation('post', '/api/v2/export/', {
    onSuccess: async () => {
      toast.success('Export created');
      await invalidator.invalidate();
      await navigate({ to: '/dashboard/exports', reloadDocument: true });
    },
  });

  return (
    <div>
      <DashboardBreadcrumb
        items={[
          { name: 'Exports', href: '/dashboard/exports' },
          {
            name: 'New',
            href: '/dashboard/exports/new',
          },
        ]}
      />

      <Separator className="my-2" />

      <div className="max-w-md mt-8 flex flex-col gap-4">
        <Label htmlFor="ids">IDs</Label>
        <Textarea
          id="ids"
          placeholder="IDs of the POIs to export.One ID per line."
          autoComplete="off"
          rows={12}
          className="min-h-96"
          value={idsText}
          onChange={(e) => setIdsText(e.target.value)}
        />
        <Button
          className="ml-auto"
          onClick={(e) => {
            e.preventDefault();
            createExportMutation.mutate({
              body: {
                include: ['image', 'address'],
                poiIds: idsText.split('\n').map((s) => s.trim()),
              },
            });
          }}
        >
          Create Export
        </Button>
      </div>
    </div>
  );
}
