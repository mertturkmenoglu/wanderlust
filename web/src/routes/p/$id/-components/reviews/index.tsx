import { RatingsSection } from './ratings-section';
import { Section } from './section';

export default function Reviews() {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <RatingsSection className="sticky top-8" />
      </div>
      <div className="flex flex-col gap-4 md:col-span-2">
        <Section />
      </div>
    </div>
  );
}
