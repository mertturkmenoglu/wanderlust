'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignInButton() {
  return (
    <Link href="/sign-in">
      <Button
        variant="default"
        className=""
        asChild
      >
        <div className="flex items-center gap-2">
          <div>Sign in</div>
          <ArrowRight className="size-4" />
        </div>
      </Button>
    </Link>
  );
}
