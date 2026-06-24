import { useState } from 'react';
import { SearchService } from '@/lib/search';

export function useSearchClient() {
	const [service] = useState(() => new SearchService());

	return service.getDefaultSearchClient();
}

type GeoSearchClientProps = {
	additionalSearchParameters?: Record<string, unknown>;
};

export function useGeoSearchClient(props?: GeoSearchClientProps) {
	const [service] = useState(() => new SearchService());

	return service.getGeoSearchClient(props?.additionalSearchParameters);
}

export function useUsersSearchClient(props?: GeoSearchClientProps) {
	const [service] = useState(() => new SearchService());

	return service.getUsersSearchClient(props?.additionalSearchParameters);
}

export function usePlacesSearchClient(props?: GeoSearchClientProps) {
	const [service] = useState(() => new SearchService());

	return service.getPlacesSearchClient(props?.additionalSearchParameters);
}

export function useCitiesSearchClient(props?: GeoSearchClientProps) {
	const [service] = useState(() => new SearchService());

	return service.getCitiesSearchClient(props?.additionalSearchParameters);
}
