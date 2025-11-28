import { ErrorComponent } from '@/components/blocks/error-component';
import { Footer } from '@/components/blocks/footer';
import { Header } from '@/components/blocks/header';
import { TanstackQueryLayout } from '@/integrations/tanstack-query/layout';
import type { AuthContextState } from '@/providers/auth-provider';
import type { FlagsResponse } from '@/providers/flags-provider';
import type { QueryClient } from '@tanstack/react-query';
import {
  Outlet,
  createRootRouteWithContext,
  useSearch,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';
import { SignInModal } from './_auth/sign-in/-modal';

interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthContextState;
  flags: FlagsResponse;
}

function Component() {
  const search = useSearch({ strict: false });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <TanStackRouterDevtools />
      <TanstackQueryLayout />
      {search.signInModal && <SignInModal />}
      <Toaster
        position="bottom-center"
        richColors
      />
    </div>
  );
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Component,
  loader: ({ context: { flags } }) => {
    const isRedirect = flags.flags['redirect-to-wip'] === true;

    if (isRedirect && globalThis.window.location.pathname !== '/wip') {
      globalThis.window.location.href = '/wip';
    }
  },
  errorComponent: ErrorComponent,
  notFoundComponent: () => {
    return (
      <ErrorComponent
        error={{ name: 'Not Found', message: 'Page not found' }}
        reset={() => {
          // do nothing
        }}
      />
    );
  },
});
