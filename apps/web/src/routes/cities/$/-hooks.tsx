export function getCityIdFromParams(splat: string | undefined): number {
	const slug = splat;

	if (!slug) {
		throw new Response('Slug is missing', { status: 404 });
	}

	const cityId = slug.split('/')[0];

	if (!cityId) {
		throw new Response('City ID is missing', { status: 404 });
	}

	const asNumber = Number(cityId);

	if (Number.isNaN(asNumber)) {
		throw new Response('City ID is not a number', { status: 404 });
	}

	return asNumber;
}
