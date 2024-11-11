import { PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Reviews() {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Reviews</h3>
        <Button variant="default">
          <span>Add a review</span>
          <PlusIcon className="size-4 ml-2" />
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        reviews will be here
      </div>
    </div>
  );
}
