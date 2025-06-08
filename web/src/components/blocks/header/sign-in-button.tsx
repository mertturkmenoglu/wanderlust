import { Button } from '@/components/ui/button';
import { useFeatureFlags } from '@/providers/flags-provider';
import { Link, useLocation } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';

export default function SignInButton() {
  const location = useLocation();
  const flags = useFeatureFlags();
  const isRedirectToWip = flags['redirect-to-wip'] === true;

  if (isRedirectToWip) {
    return <></>;
  }

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
      <Button
        variant="default"
        className=""
        asChild
      >
        <div className="flex items-center gap-2">
          <div>Sign in</div>
          <ArrowRightIcon className="size-4" />
        </div>
      </Button>
    </Link>
  );
}
