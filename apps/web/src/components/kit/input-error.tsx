import { cn } from '@/lib/utils';
import type { FieldError } from 'react-hook-form';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  error?: FieldError;
};

export function InputError({ error, className, ...props }: Props) {
  if (error === undefined) {
    return null;
  }

  return (
    <div
      className={cn('mt-1 text-xs text-red-500', className)}
      {...props}
    >
      {error.message}
    </div>
  );
}
