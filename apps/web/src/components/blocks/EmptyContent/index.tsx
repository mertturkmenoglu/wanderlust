import Logo from '@/app/icon.png';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  className?: string;
  showBackButton?: boolean;
  errorMessage?: string;
};

export default function EmptyContent({
  className,
  errorMessage,
  showBackButton = true,
}: Props) {
  return (
    <div
      className={clsx(
        'flex h-full flex-col items-center justify-center space-y-4',
        className
      )}
    >
      <Image
        src={Logo}
        alt="Wanderlust"
        className="size-24 grayscale"
      />
      {errorMessage && (
        <p className="text-lg font-semibold text-muted-foreground">
          {errorMessage}
        </p>
      )}
      {errorMessage === undefined && (
        <p className="text-lg font-semibold text-muted-foreground">
          It looks like there&apos;s nothing here.
        </p>
      )}
      {showBackButton && (
        <Button
          asChild
          variant="link"
        >
          <Link href="/">Go back to the homepage</Link>
        </Button>
      )}
    </div>
  );
}
