import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import type { ComponentIcon } from 'lucide-react';

type TIcon = typeof ComponentIcon;

type ItemProps = {
  href: string;
  text: string;
  icon: TIcon;
};

export function Item({ href, text, icon: Icon }: ItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-2 text-muted-foreground justify-center rounded',
        'border border-border h-16 hover:border-primary hover:text-primary',
      )}
    >
      <Icon className="size-4" />
      <span className="text-balance text-center">{text}</span>
    </Link>
  );
}
