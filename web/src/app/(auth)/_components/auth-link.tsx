import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {
  href: string;
  text: string;
  className?: string;
};

export default function AuthLink({ href, text, className }: Readonly<Props>) {
  return (
    <Button
      asChild
      variant="link"
      className={cn('px-0 underline', className)}
    >
      <Link href={href}>{text}</Link>
    </Button>
  );
}
