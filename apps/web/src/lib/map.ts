// export const tileUrl = `https://api.maptiler.com/maps/streets-v2-light/256/{z}/{x}/{y}.png?key=${env.VITE_MAPTILER_KEY}`;

import { env } from './env';

// Update this styles array from time to time with the latest styles from this URL:
// https://github.com/maptiler/maptiler-client-js/blob/main/src/mapstyle.ts
// or use the map-styles command in apps/cli to fetch the latest styles
// and save them to a JSON file, then copy the contents of that file here.
const styles = [
	{
		key: 'streets-v2',
		text: 'Streets V2',
	},
	{
		key: 'streets-v2-dark',
		text: 'Streets V2 Dark',
	},
	{
		key: 'streets-v2-light',
		text: 'Streets V2 Light',
	},
	{
		key: 'streets-v2-night',
		text: 'Streets V2 Night',
	},
	{
		key: 'streets-v2-pastel',
		text: 'Streets V2 Pastel',
	},
	{
		key: 'streets-v4',
		text: 'Streets V4',
	},
	{
		key: 'streets-v4-dark',
		text: 'Streets V4 Dark',
	},
	{
		key: 'streets-v4-pastel',
		text: 'Streets V4 Pastel',
	},
	{
		key: 'base-v4',
		text: 'Base V4',
	},
	{
		key: 'base-v4-dark',
		text: 'Base V4 Dark',
	},
	{
		key: 'base-v4-light',
		text: 'Base V4 Light',
	},
	{
		key: 'base-v4-ai',
		text: 'Base V4 Ai',
	},
	{
		key: 'outdoor-v2',
		text: 'Outdoor V2',
	},
	{
		key: 'outdoor-v2-dark',
		text: 'Outdoor V2 Dark',
	},
	{
		key: 'winter-v2',
		text: 'Winter V2',
	},
	{
		key: 'winter-v2-dark',
		text: 'Winter V2 Dark',
	},
	{
		key: 'winter-v4',
		text: 'Winter V4',
	},
	{
		key: 'winter-v4-dark',
		text: 'Winter V4 Dark',
	},
	{
		key: 'satellite',
		text: 'Satellite',
	},
	{
		key: 'hybrid',
		text: 'Hybrid',
	},
	{
		key: 'hybrid-v4',
		text: 'Hybrid V4',
	},
	{
		key: 'hybrid-v4-dark',
		text: 'Hybrid V4 Dark',
	},
	{
		key: 'basic-v2',
		text: 'Basic V2',
	},
	{
		key: 'basic-v2-dark',
		text: 'Basic V2 Dark',
	},
	{
		key: 'basic-v2-light',
		text: 'Basic V2 Light',
	},
	{
		key: 'bright-v2',
		text: 'Bright V2',
	},
	{
		key: 'bright-v2-dark',
		text: 'Bright V2 Dark',
	},
	{
		key: 'bright-v2-light',
		text: 'Bright V2 Light',
	},
	{
		key: 'bright-v2-pastel',
		text: 'Bright V2 Pastel',
	},
	{
		key: 'openstreetmap',
		text: 'Openstreetmap',
	},
	{
		key: 'openstreetmap-dark',
		text: 'Openstreetmap Dark',
	},
	{
		key: 'topo-v2',
		text: 'Topo V2',
	},
	{
		key: 'topo-v2-dark',
		text: 'Topo V2 Dark',
	},
	{
		key: 'topo-v2-shiny',
		text: 'Topo V2 Shiny',
	},
	{
		key: 'topo-v2-pastel',
		text: 'Topo V2 Pastel',
	},
	{
		key: 'topo-v2-topographique',
		text: 'Topo V2 Topographique',
	},
	{
		key: 'voyager-v2',
		text: 'Voyager V2',
	},
	{
		key: 'voyager-v2-darkmatter',
		text: 'Voyager V2 Darkmatter',
	},
	{
		key: 'voyager-v2-positron',
		text: 'Voyager V2 Positron',
	},
	{
		key: 'voyager-v2-vintage',
		text: 'Voyager V2 Vintage',
	},
	{
		key: 'toner-v2',
		text: 'Toner V2',
	},
	{
		key: 'toner-v2-background',
		text: 'Toner V2 Background',
	},
	{
		key: 'toner-v2-lite',
		text: 'Toner V2 Lite',
	},
	{
		key: 'toner-v2-lines',
		text: 'Toner V2 Lines',
	},
	{
		key: 'dataviz',
		text: 'Dataviz',
	},
	{
		key: 'dataviz-dark',
		text: 'Dataviz Dark',
	},
	{
		key: 'dataviz-light',
		text: 'Dataviz Light',
	},
	{
		key: 'backdrop',
		text: 'Backdrop',
	},
	{
		key: 'backdrop-dark',
		text: 'Backdrop Dark',
	},
	{
		key: 'backdrop-light',
		text: 'Backdrop Light',
	},
	{
		key: 'ocean',
		text: 'Ocean',
	},
	{
		key: 'aquarelle',
		text: 'Aquarelle',
	},
	{
		key: 'aquarelle-dark',
		text: 'Aquarelle Dark',
	},
	{
		key: 'aquarelle-vivid',
		text: 'Aquarelle Vivid',
	},
	{
		key: 'landscape',
		text: 'Landscape',
	},
	{
		key: 'landscape-dark',
		text: 'Landscape Dark',
	},
	{
		key: 'landscape-vivid',
		text: 'Landscape Vivid',
	},
	{
		key: 'landscape-v4',
		text: 'Landscape V4',
	},
	{
		key: 'landscape-v4-dark',
		text: 'Landscape V4 Dark',
	},
	{
		key: 'landscape-v4-vivid',
		text: 'Landscape V4 Vivid',
	},
	{
		key: 'satellite-v4',
		text: 'Satellite V4',
	},
	{
		key: 'satellite-v4-dark',
		text: 'Satellite V4 Dark',
	},
	{
		key: 'dataviz-v4',
		text: 'Dataviz V4',
	},
	{
		key: 'dataviz-v4-dark',
		text: 'Dataviz V4 Dark',
	},
	{
		key: 'dataviz-v4-light',
		text: 'Dataviz V4 Light',
	},
	{
		key: 'outdoor-v4',
		text: 'Outdoor V4',
	},
	{
		key: 'outdoor-v4-dark',
		text: 'Outdoor V4 Dark',
	},
	{
		key: 'backdrop-v4',
		text: 'Backdrop V4',
	},
	{
		key: 'backdrop-v4-dark',
		text: 'Backdrop V4 Dark',
	},
	{
		key: 'backdrop-v4-light',
		text: 'Backdrop V4 Light',
	},
	{
		key: 'aquarelle-v4',
		text: 'Aquarelle V4',
	},
	{
		key: 'aquarelle-v4-dark',
		text: 'Aquarelle V4 Dark',
	},
	{
		key: 'aquarelle-v4-vivid',
		text: 'Aquarelle V4 Vivid',
	},
	{
		key: 'ocean-v4',
		text: 'Ocean V4',
	},
	{
		key: 'ocean-v4-dark',
		text: 'Ocean V4 Dark',
	},
	{
		key: 'topo-v4',
		text: 'Topo V4',
	},
	{
		key: 'topo-v4-dark',
		text: 'Topo V4 Dark',
	},
	{
		key: 'topo-v4-pastel',
		text: 'Topo V4 Pastel',
	},
	{
		key: 'topo-v4-topographique',
		text: 'Topo V4 Topographique',
	},
] as const satisfies Array<{ key: string; text: string }>;

export type MapStyle = (typeof styles)[number]['key'];

export function createStyle(style: MapStyle) {
	return `https://api.maptiler.com/maps/${style}/style.json?key=${env.VITE_MAPTILER_KEY}`;
}
