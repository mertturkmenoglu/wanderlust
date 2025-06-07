import { cn } from '@/lib/utils';

type InfoCardProps = {
  className?: string;
  children: React.ReactNode;
};

export function InfoCardRoot({ className, children }: InfoCardProps) {
  return (
    <div
      className={cn(
        'bg-primary/5 aspect-video rounded-lg p-4 flex items-center',
        className,
      )}
    >
      {children}
    </div>
  );
}

type ContentProps = {
  className?: string;
  children: React.ReactNode;
};

export function Content({ className, children }: ContentProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>{children}</div>
  );
}

type NumberColumnProps = {
  className?: string;
  children: React.ReactNode;
};

export function NumberColumn({ className, children }: NumberColumnProps) {
  return (
    <span
      className={cn('font-bold text-3xl md:text-6xl text-primary', className)}
    >
      {children}
    </span>
  );
}

type DescriptionColumnProps = {
  className?: string;
  children: React.ReactNode;
};

export function DescriptionColumn({
  className,
  children,
}: DescriptionColumnProps) {
  return <span className={cn(className)}>{children}</span>;
}

export const InfoCard = {
  Root: InfoCardRoot,
  Content,
  NumberColumn,
  DescriptionColumn,
};
