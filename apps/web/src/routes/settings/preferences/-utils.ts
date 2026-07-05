import type { TPreferences } from '@/stores/preferences-context';

type UnitOption = {
	key: TPreferences['units'];
	label: string;
};

export const unitsOptions: UnitOption[] = [
	{
		key: 'metric',
		label: 'Metric',
	},
	{
		key: 'imperial',
		label: 'Imperial',
	},
];

type MapStyleOption = {
	key: TPreferences['mapStyle'];
	label: string;
};

export const mapStyleOptions: MapStyleOption[] = [
	{
		key: 'light',
		label: 'Light',
	},
	{
		key: 'dark',
		label: 'Dark',
	},
	{
		key: 'auto',
		label: 'Auto',
	},
];

type SearchRadiusOption = {
	key: TPreferences['searchRadius'];
	label: string;
};

export const searchRadiusOptions: SearchRadiusOption[] = [
	{
		key: 'close',
		label: 'Close',
	},
	{
		key: 'medium',
		label: 'Medium',
	},
	{
		key: 'far',
		label: 'Far',
	},
];

type ThemeOption = {
	key: TPreferences['theme'];
	label: string;
};

export const themeOptions: ThemeOption[] = [
	{
		key: 'light',
		label: 'Light',
	},
	{
		key: 'dark',
		label: 'Dark',
	},
	{
		key: 'system',
		label: 'System',
	},
];
