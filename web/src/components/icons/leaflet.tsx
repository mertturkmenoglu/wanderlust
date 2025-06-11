import mapPinIcon from '@/map-pin.svg';
import L from 'leaflet';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const icon = L.icon({
  iconUrl: mapPinIcon,
  iconRetinaUrl: mapPinIcon,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

const defaultIcon = L.icon({
  iconRetinaUrl: iconRetina,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export { defaultIcon, icon };
