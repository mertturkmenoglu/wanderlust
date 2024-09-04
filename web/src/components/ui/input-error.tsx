import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  error?: FieldError;
};

export default function InputError({ error, className, ...props }: Props) {
  if (error === undefined) {
    return <></>;
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
