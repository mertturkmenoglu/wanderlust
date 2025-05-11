import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLocation, useRouter } from '@tanstack/react-router';
import { SignInCard } from './-card';

export function SignInModal() {
  const location = useLocation();
  const router = useRouter();

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          router.navigate({
            to: location.pathname,
            search: {},
          });
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <SignInCard isModal={true} />
      </DialogContent>
    </Dialog>
  );
}
