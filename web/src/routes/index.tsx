import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div className="mx-auto max-w-7xl mt-8">
      <Button>Hello</Button>
    </div>
  );
}
