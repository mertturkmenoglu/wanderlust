import { createFileRoute } from '@tanstack/react-router';
import { ErrorComponent } from '@/components/error-component';
import { Breadcrumb } from './-components/breadcrumb';
import { Header } from './-components/header';

export const Route = createFileRoute('/e/$id/')({
	component: RouteComponent,
	errorComponent: ErrorComponent,
	// loader: ({ context, params }) => {
	// 	console.log('Loader called with params:', params);
	// 	return context.queryClient.ensureQueryData(
	// 		context.orpc.events.get.queryOptions({
	// 			input: {
	// 				id: params.id,
	// 			},
	// 		}),
	// 	);
	// },
});

function RouteComponent() {
	return (
		<main className="mx-auto mt-8 max-w-7xl">
			<Breadcrumb />

			<Header className="mt-8" />
		</main>
	);
}
