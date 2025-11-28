import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';

type Props = {
  className?: string;
  showBackButton?: boolean;
  errorMessage?: React.ReactNode;
  successMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  imageClassName?: string;
  backLink?: string;
  backLinkText?: string;
};

export function AppMessage({
  className,
  errorMessage,
  successMessage,
  emptyMessage,
  showBackButton = true,
  imageClassName,
  backLink = '/',
  backLinkText = 'Go back to the homepage',
}: Readonly<Props>) {
  return (
    <div
      className={clsx(
        'flex h-full flex-col items-center justify-center space-y-4',
        className,
      )}
    >
      <img
        src="/logo.png"
        alt="Wanderlust"
        className={cn(
          'size-24',
          {
            grayscale: !successMessage,
          },
          imageClassName,
        )}
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
          className={cn({
            'text-destructive': errorMessage,
          })}
        >
          <Link to={backLink}>{backLinkText}</Link>
        </Button>
      )}
    </div>
  );
}
