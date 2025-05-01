import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

type Props = {
  className?: string;
  imgClassName?: string;
  fallbackClassName?: string;
  src: string | null;
  initials?: string | null;
};

export default function UserImage({
  className,
  imgClassName,
  fallbackClassName,
  src,
  initials = '',
}: Readonly<Props>) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.setAttribute('referrerpolicy', 'no-referrer');
    }
  }, [imgRef]);

  return (
    <Avatar className={cn('rounded-full', className)}>
      <AvatarImage
        src={src ?? ''}
        referrerPolicy="no-referrer"
        className={cn('object-cover', imgClassName)}
      />
      <AvatarFallback
        delayMs={1000}
        className={cn(
          'rounded-full bg-gradient-to-br from-sky-600 via-cyan-500 to-teal-600 text-2xl font-semibold text-white',
          fallbackClassName,
        )}
      >
        {initials ?? ''}
      </AvatarFallback>
    </Avatar>
  );
}
