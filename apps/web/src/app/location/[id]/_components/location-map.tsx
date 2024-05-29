import { Location } from "@/lib/types";
import { GoogleMapsEmbed } from "@next/third-parties/google";

type Props = { location: Location };

export default function LocationMap({ location }: Props) {
  const loc = `${location.address.lat},${location.address.long}`;

  return (
    <div className="mx-auto flex justify-end">
      <GoogleMapsEmbed
        apiKey={process.env.GOOGLE_MAP_EMBED_API_KEY ?? ""}
        height={256}
        width="100%"
        zoom="18"
        center={loc}
        mode="view"
      />
    </div>
  );
}
