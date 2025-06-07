import { env } from './env';

export const tileUrl = `https://api.maptiler.com/maps/streets-v2-light/256/{z}/{x}/{y}.png?key=${env.VITE_MAPTILER_KEY}`;
