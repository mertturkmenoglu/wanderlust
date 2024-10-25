import { cn } from "~/lib/utils";

type Props = {
  className?: string;
  image: string;
  alt: string;
  message: React.ReactNode;
  imgClassName?: string;
  lefty?: boolean;
} & Pick<React.ComponentProps<"img">, "fetchPriority" | "loading">;

export default function ActionBanner({
  className,
  image,
  alt,
  message,
  imgClassName,
  lefty = true,
  fetchPriority = "auto",
  loading = "eager",
}: Props) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-4xl flex-col items-center rounded-xl border border-border md:flex-row",
        {
          "md:flex-row-reverse": !lefty,
        },
        className
      )}
    >
      <img
        src={image}
        className={cn(
          "aspect-video w-full rounded-t-xl md:rounded-t-none object-cover md:aspect-square md:max-w-md",
          {
            "md:rounded-l-xl md:rounded-tl-xl": lefty,
            "md:rounded-r-xl md:rounded-tr-xl": !lefty,
          },
          imgClassName
        )}
        role="presentation"
        fetchPriority={fetchPriority}
        loading={loading}
        alt={alt}
      />
      <div className="p-8 md:p-4 lg:p-8">
        <div className="">{message}</div>
      </div>
    </div>
  );
}
