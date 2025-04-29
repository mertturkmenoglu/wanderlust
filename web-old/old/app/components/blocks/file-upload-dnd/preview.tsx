import { useEffect, useState } from "react";
import { getPreview } from "~/lib/image-utils";

type Props = {
  file: File;
};

export default function Preview({ file }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    getPreview(file).then((s) => {
      setSrc(s);
    });
  }, [file]);

  if (!src) {
    return <></>;
  }

  return (
    <img src={src} alt={file.name} className="size-32 rounded object-cover" />
  );
}
