// export const tileUrl = `https://api.maptiler.com/maps/streets-v2-light/256/{z}/{x}/{y}.png?key=${env.VITE_MAPTILER_KEY}`;

import { env } from './env';

export const styles = [
  {
    key: 'streets-v2',
    text: 'Streets Default',
  },
  {
    key: 'streets-v2-light',
    text: 'Streets - Light',
  },
  {
    key: 'streets-v2-dark',
    text: 'Streets - Dark',
  },
  {
    key: 'streets-v2-pastel',
    text: 'Streets - Pastel',
  },
  {
    key: 'streets-v2-night',
    text: 'Streets - Night',
  },
  {
    key: 'outdoor-v2',
    text: 'Outdoor Default',
  },
  {
    key: 'outdoor-v2-dark',
    text: 'Outdoor - Dark',
  },
  {
    key: 'winter-v2',
    text: 'Winter Default',
  },
  {
    key: 'winter-v2-dark',
    text: 'Winter - Dark',
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
    key: 'basic-v2',
    text: 'Basic Default',
  },
  {
    key: 'basic-v2-dark',
    text: 'Basic - Dark',
  },
  {
    key: 'basic-v2-light',
    text: 'Basic - Light',
  },
  {
    key: 'bright-v2',
    text: 'Bright Default',
  },
  {
    key: 'bright-v2-dark',
    text: 'Bright - Dark',
  },
  {
    key: 'bright-v2-light',
    text: 'Bright - Light',
  },
  {
    key: 'bright-v2-pastel',
    text: 'Bright - Pastel',
  },
  {
    key: 'openstreetmap',
    text: 'OpenStreetMap',
  },
  {
    key: 'topo-v2',
    text: 'Topo Default',
  },
  {
    key: 'topo-v2-dark',
    text: 'Topo - Dark',
  },
  {
    key: 'topo-v2-shiny',
    text: 'Topo - Shiny',
  },
  {
    key: 'topo-v2-pastel',
    text: 'Topo - Pastel',
  },
  {
    key: 'topo-v2-topographique',
    text: 'Topo - Topographique',
  },
  {
    key: 'voyager-v2',
    text: 'Voyager Default',
  },
  {
    key: 'voyager-v2-darkmatter',
    text: 'Voyager - Dark Matter',
  },
  {
    key: 'voyager-v2-positron',
    text: 'Voyager - Positron',
  },
  {
    key: 'voyager-v2-vintage',
    text: 'Voyager - Vintage',
  },
  {
    key: 'toner-v2',
    text: 'Toner Default',
  },
  {
    key: 'toner-v2-background',
    text: 'Toner - Background',
  },
  {
    key: 'toner-v2-lines',
    text: 'Toner - Lines',
  },
  {
    key: 'dataviz',
    text: 'Dataviz',
  },
  {
    key: 'dataviz-dark',
    text: 'Dataviz - Dark',
  },
  {
    key: 'dataviz-light',
    text: 'Dataviz - Light',
  },
  {
    key: 'backdrop',
    text: 'Backdrop',
  },
  {
    key: 'backdrop-dark',
    text: 'Backdrop - Dark',
  },
  {
    key: 'backdrop-light',
    text: 'Backdrop - Light',
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
    text: 'Aquarelle - Dark',
  },
  {
    key: 'aquarelle-vivid',
    text: 'Aquarelle - Vivid',
  },
  {
    key: 'landscape',
    text: 'Landscape',
  },
  {
    key: 'landscape-dark',
    text: 'Landscape - Dark',
  },
  {
    key: 'landscape-vivid',
    text: 'Landscape - Vivid',
  },
] as const satisfies Array<{ key: string; text: string }>;

export type MapStyle = (typeof styles)[number]['key'];

export function createStyle(style: MapStyle) {
  return `https://api.maptiler.com/maps/${style}/style.json?key=${
    env.VITE_MAPTILER_KEY
  }`;
}
