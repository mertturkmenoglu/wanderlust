import { createFileRoute, Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { renderer } from '@/components/details/renderer';
import { Show } from '@/components/show';
import { ensureData, getDefaultStaticData } from '@/lib/defaults';
import { defineRows } from '@/lib/define-rows';
import { citiesResource as r } from '@/resources/cities';

export const Route = createFileRoute('/dashboard/cities/$id')({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		return ensureData(r, context.qc, {
			input: {
				id: +params.id,
			},
		});
	},
	staticData: getDefaultStaticData(r, 'details'),
});

function RouteComponent() {
	const { city } = Route.useLoaderData();

	const rows = defineRows([
		['ID', city.id.toString()],
		['Name', city.name],
		['Description', renderer.JSON(city.description)],
		['State Code', city.stateCode],
		['State Name', city.stateName],
		['Country Code', city.countryCode],
		['Country Name', city.countryName],
		['Image', renderer.Image(city.image)],
		['Coordinates', `Lat: ${city.lat}, Lng: ${city.lng}`],
		['Timezone', city.timezone],
		[
			'Collections',
			<Link
				to="/dashboard/cities/$id/collections"
				params={{ id: city.id.toString() }}
				className={buttonVariants({ variant: 'link', className: 'px-0!' })}
			>
				See collections related to this city
			</Link>,
		],
	]);

	return (
		<Show
			resource={r}
			input={{
				id: city.id,
			}}
			deleteInput={{
				id: city.id,
			}}
			rows={rows}
			data={city}
		/>
	);
}
