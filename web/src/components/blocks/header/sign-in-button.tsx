import { Button } from '@/components/ui/button';
import { Link, useLocation } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

export default function SignInButton() {
  const location = useLocation();

  return (
    <Link
      to={location.pathname}
      search={{
        signInModal: true,
      }}
      mask={{
        to: location.pathname,
      }}
    >
      <Button variant="default" className="" asChild>
        <div className="flex items-center gap-2">
          <div>Sign in</div>
          <ArrowRight className="size-4" />
        </div>
      </Button>
    </Link>
  );
}
