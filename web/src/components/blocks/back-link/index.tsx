import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

type Props = {
  className?: string;
  href: string;
  text?: string;
};

export default function BackLink({ href, className, text = 'Go back' }: Props) {
  return (
    <Link
      to={href}
      className={cn(buttonVariants({ variant: 'link' }), '!px-0', className)}
    >
      <div className="flex items-center gap-2 px-0">
        <ArrowLeftIcon className="size-4" />
        <div>{text}</div>
      </div>
    </Link>
  );
}
