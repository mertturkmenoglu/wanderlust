import { Spinner } from '@wanderlust/ui/components/spinner';
import { Header } from './-header';

export function Loading() {
	return (
		<div>
			<Header />
			<Spinner className="mx-auto my-8 size-12" />
		</div>
	);
}
