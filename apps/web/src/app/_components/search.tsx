import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export default function Search() {
  return (
    <nav className="mx-auto my-12 flex items-center justify-center space-x-4">
      <input
        className="w-10/12 rounded-full border border-muted-foreground px-8 py-4 lg:w-1/2"
        placeholder="Search a location or an event"
      />

      <Button
        size="icon"
        className="size-12 rounded-full"
      >
        <MagnifyingGlassIcon className="size-6" />
      </Button>
    </nav>
  );
}
