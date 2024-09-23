import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Wanderlust" },
    {
      name: "description",
      content: "Inspiring explorations, one spark of Wanderlust!",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto my-8">
      <div>
        <div>Hello world</div>
        <Button variant="default">Default</Button>
      </div>
    </div>
  );
}
