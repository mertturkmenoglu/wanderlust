import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto bg-red-500 mt-8">
      <Button>Hello World</Button>
    </div>
  );
}
