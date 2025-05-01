import { cn } from '@/lib/utils';

type Props = {
  image: string;
  className?: string;
  imageClassName?: string;
  alt: string;
  content: React.ReactNode;
};

export default function VerticalBanner({
  image,
  className,
  imageClassName,
  alt,
  content,
}: Props) {
  return (
    <div
      className={cn('mx-auto flex max-w-4xl flex-col items-center', className)}
    >
      <img
        src={image}
        alt={alt}
        className={cn('aspect-square size-80', imageClassName)}
      />

      <div>{content}</div>
    </div>
  );
}
