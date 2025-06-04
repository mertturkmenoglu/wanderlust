const maptilerPK =
  import.meta.env.VITE_MAPTILER_KEY ?? '__invalid-maptiler-key';

export const tileUrl = `https://api.maptiler.com/maps/streets-v2-light/256/{z}/{x}/{y}.png?key=${maptilerPK}`;
