import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DiscoverAroundYou() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center">
      <img
        src="https://i.imgur.com/Y3ujIqE.jpg"
        alt="Discover new locations"
        className="aspect-square size-80"
      />

      <div className="text-center">
        <h2 className="mt-8 font-serif text-3xl font-bold text-black/80">
          Discover new locations around you
        </h2>
        <p className="font-serif text-muted-foreground">
          Find new places to explore and enjoy with your friends and family.
        </p>
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="mt-8"
        >
          <Link href="/geo">Start Exploring</Link>
        </Button>
      </div>
    </div>
  );
}
