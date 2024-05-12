import CategoryNavigation from "@/components/blocks/CategoryNavigation";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <main className="">
      <nav className="mx-auto flex justify-center my-12 items-center space-x-4">
        <input
          className="border border-muted-foreground w-10/12 lg:w-1/2 py-4 rounded-full px-8"
          placeholder="Search a location or an event"
        />

        <Button size="icon" className="rounded-full size-12">
          <MagnifyingGlassIcon className="size-6" />
        </Button>
      </nav>

      <CategoryNavigation />

      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tighter lg:text-3xl text-accent-foreground mt-12">
        Discover What&apos;s Around you
      </h2>
    </main>
  );
}
