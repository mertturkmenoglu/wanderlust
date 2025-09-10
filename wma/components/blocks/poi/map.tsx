import type { components } from "@/api/types";
import { tileUrl } from "@/lib/map";
import MapView, { Marker, UrlTile } from "react-native-maps";

type Props = {
  poi: components["schemas"]["Poi"];
};

export function PoiMap({ poi }: Props) {
  return (
    <MapView
      region={{
        latitude: poi.address.lat,
        longitude: poi.address.lng,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      }}
      style={{
        width: "100%",
        height: 256,
        marginTop: 16,
      }}
      scrollDuringRotateOrZoomEnabled={false}
      scrollEnabled={false}
    >
      <UrlTile urlTemplate={tileUrl} maximumZ={19} flipY={false} />
      <Marker
        coordinate={{ latitude: poi.address.lat, longitude: poi.address.lng }}
        title={poi.name}
        titleVisibility="visible"
      />
    </MapView>
  );
}
