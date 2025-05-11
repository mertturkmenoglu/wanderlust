import { cn } from '@/lib/utils';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
};

export default function InputInfo({ text, className, ...props }: Props) {
  return (
    <div
      className={cn('mt-1 text-xs text-muted-foreground', className)}
      {...props}
    >
      {text}
    </div>
  );
}
