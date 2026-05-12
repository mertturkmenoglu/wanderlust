import { LoaderCircleIcon } from 'lucide-react';

export function Loading() {
	return (
		<div className="flex flex-col items-center justify-center">
			<LoaderCircleIcon className="mx-auto mt-32 size-12 animate-spin text-primary" />
			<div className="mt-8 mb-32 text-sm">Allow access to your location</div>
		</div>
	);
}
