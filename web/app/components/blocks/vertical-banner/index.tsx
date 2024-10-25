import { cn } from "~/lib/utils";

type Props = {
  image: string;
  className?: string;
  imageClassName?: string;
  alt: string;
  content: React.ReactNode;
} & Pick<React.ComponentProps<"img">, "fetchPriority" | "loading">;

export default function VerticalBanner({
  image,
  className,
  imageClassName,
  alt,
  content,
  fetchPriority = "auto",
  loading = "eager",
}: Props) {
  return (
    <div
      className={cn("mx-auto flex max-w-4xl flex-col items-center", className)}
    >
      <img
        src={image}
        alt={alt}
        fetchPriority={fetchPriority}
        loading={loading}
        className={cn("aspect-square size-80", imageClassName)}
      />

      <div>{content}</div>
    </div>
  );
}
