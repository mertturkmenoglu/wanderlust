import { Skeleton } from '@/components/ui/skeleton';
import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  UserProfile,
} from '@clerk/nextjs';

function Page() {
  return (
    <div>
      <div className="container mx-auto flex justify-center">
        <ClerkLoading>
          <Skeleton className="h-96 w-full bg-muted" />
        </ClerkLoading>
        <ClerkLoaded>
          <div className="space-y-4">
            <UserProfile />
            <OrganizationSwitcher />
          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
}

export default Page;
