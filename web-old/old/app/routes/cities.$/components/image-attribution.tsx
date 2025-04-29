import { GetCityByIdResponseDto } from "~/lib/dto";

export type Props = Pick<
  GetCityByIdResponseDto,
  | "imageAttribute"
  | "imageAttributionLink"
  | "imageLicense"
  | "imageLicenseLink"
>;

export default function ImageAttributes({
  imageAttribute,
  imageAttributionLink,
  imageLicense,
  imageLicenseLink,
}: Props) {
  return (
    <>
      <a href={imageLicenseLink ?? "#"} className="block text-sm">
        License:{" "}
        <span className="text-muted-foreground hover:underline">
          {imageLicense ?? "-"}
        </span>
      </a>
      <a href={imageAttributionLink ?? "#"} className="block text-sm break-all">
        Attribution:{" "}
        <span className="text-muted-foreground hover:underline">
          {imageAttribute ?? "-"}
        </span>
      </a>
    </>
  );
}
