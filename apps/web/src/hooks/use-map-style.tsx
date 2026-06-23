import { useMemo } from 'react';
import { createStyle } from '@/lib/map';
import { usePreferencesStore } from '@/stores/preferences-context';

export function useMapStyle() {
	const mapStylePreference = usePreferencesStore((s) => s.preferences.mapStyle);
	const theme = usePreferencesStore((s) => s.preferences.theme);

	const maptilerStyle = useMemo(() => {
		switch (mapStylePreference) {
			case 'light':
				return 'streets-v2-light';
			case 'dark':
				return 'streets-v2-dark';
			case 'auto':
				return theme === 'dark' ? 'streets-v2-dark' : 'streets-v2-light';
		}
	}, [mapStylePreference, theme]);

	return createStyle(maptilerStyle);
}
