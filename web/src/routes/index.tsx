import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const q = api.useQuery('get', '/api/v2/health');

  return (
    <div className="mx-auto max-w-7xl mt-8">
      <Button>Hello</Button>
      <div>{q.data?.message}</div>
    </div>
  );
}
