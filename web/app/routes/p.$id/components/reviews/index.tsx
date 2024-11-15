import CreateDialog from "./create-dialog";
import { Section } from "./section";

export default function Reviews() {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">Reviews</h3>
        <CreateDialog />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <Section />
      </div>
    </div>
  );
}
