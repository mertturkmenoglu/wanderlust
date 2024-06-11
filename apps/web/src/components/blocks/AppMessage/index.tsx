import Logo from '@/app/icon.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  className?: string;
  showBackButton?: boolean;
  errorMessage?: React.ReactNode;
  successMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
};

export default function AppMessage({
  className,
  errorMessage,
  successMessage,
  emptyMessage,
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
        className={cn('size-24', {
          grayscale: !successMessage,
        })}
      />
      {errorMessage && (
        <div className="text-lg font-semibold text-destructive">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="text-lg font-semibold text-primary">
          {successMessage}
        </div>
      )}
      {emptyMessage && (
        <div className="text-lg font-semibold text-muted-foreground">
          {emptyMessage}
        </div>
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
