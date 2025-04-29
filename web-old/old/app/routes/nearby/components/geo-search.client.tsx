import { LeafletEvent } from "leaflet";
import { UseGeoSearchProps, useGeoSearch } from "react-instantsearch";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { Link } from "react-router";

export default function GeoSearch(props: UseGeoSearchProps) {
  const { items, refine } = useGeoSearch(props);

  function onViewChange({ target }: LeafletEvent) {
    refine({
      northEast: target.getBounds().getNorthEast(),
      southWest: target.getBounds().getSouthWest(),
    });
  }

  useMapEvents({ zoomend: onViewChange, dragend: onViewChange });

  return (
    <>
      {items.map((item) => (
        <Marker key={item.objectID} position={item._geoloc}>
          <Popup>
            <Link to={`/p/${item.poi.Poi.ID}`}>{item.name}</Link>
            <div>{item.poi.Poi.Description.slice(0, 100)}...</div>
            <div>
              {item.poi.City.Name}, {item.poi.City.StateName} /{" "}
              {item.poi.City.CountryName}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
