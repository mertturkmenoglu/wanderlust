import Header from "./header";
import { Section } from "./section";

export default function Reviews() {
  return (
    <div className="mt-4">
      <Header />
      <div className="flex flex-col gap-4 mt-8">
        <Section />
      </div>
    </div>
  );
}
