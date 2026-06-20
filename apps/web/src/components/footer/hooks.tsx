import { useMatches } from '@tanstack/react-router';
import type { FileRouteTypes } from '@/routeTree.gen';

type ValidRouteId = FileRouteTypes['id'];

const dontRenderOnPages: ValidRouteId[] = ['/chat', '/settings'];

export function useShouldRender() {
	const matches = useMatches();

	if (matches.some((match) => dontRenderOnPages.includes(match.routeId))) {
		return false;
	}

	return true;
}
