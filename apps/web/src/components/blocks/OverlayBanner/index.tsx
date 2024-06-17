import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  image: string;
  alt: string;
  message: React.ReactNode;
  imgClassName?: string;
};

export default function OverlayBanner({
  className,
  image,
  alt,
  message,
  imgClassName,
}: Props) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-md bg-black/90',
        className
      )}
    >
      <img
        src={image}
        className={cn(
          'aspect-[5] h-full rounded-md object-cover opacity-70',
          imgClassName
        )}
        role="presentation"
        alt={alt}
      />
      <div className="absolute bottom-2 left-2 rounded-md px-8 py-4 md:bottom-8 md:left-8">
        <div className="text-base font-bold text-white md:text-2xl">
          {message}
        </div>
      </div>
    </div>
  );
}
