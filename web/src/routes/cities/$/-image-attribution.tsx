export type Props = {
  attribute: string | null;
  attributionLink: string | null;
  license: string | null;
  licenseLink: string | null;
};

export default function ImageAttributes({
  attribute,
  attributionLink,
  license,
  licenseLink,
}: Props) {
  return (
    <>
      <a href={licenseLink ?? '#'} className="block text-sm">
        License:{' '}
        <span className="text-muted-foreground hover:underline">
          {license ?? '-'}
        </span>
      </a>
      <a href={attributionLink ?? '#'} className="block text-sm break-all">
        Attribution:{' '}
        <span className="text-muted-foreground hover:underline">
          {attribute ?? '-'}
        </span>
      </a>
    </>
  );
}
