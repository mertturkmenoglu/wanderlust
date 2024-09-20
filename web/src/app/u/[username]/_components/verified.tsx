import { BadgeCheckIcon } from 'lucide-react';

export default function Verified() {
  return (
    <div className="mt-2 flex items-center gap-2">
      <BadgeCheckIcon className="size-6 text-primary" />
      <span className="text-sm text-gray-500">Verified</span>
    </div>
  );
}
