import { ErrorComponent } from '@/components/blocks/error-component';
import Footer from '@/components/blocks/footer';
import Header from '@/components/blocks/header';
import { type AuthContextState } from '@/providers/auth-provider';
import type { QueryClient } from '@tanstack/react-query';
import {
  Outlet,
  createRootRouteWithContext,
  useSearch,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';
import TanstackQueryLayout from '../integrations/tanstack-query/layout';
import { SignInModal } from './_auth/sign-in/-modal';

interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthContextState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const search = useSearch({ strict: false });

    return (
      <div>
        <Header />
        <Outlet />
        <Footer />
        <TanStackRouterDevtools />
        <TanstackQueryLayout />
        {search.signInModal && <SignInModal />}
        <Toaster position="bottom-center" richColors />
      </div>
    );
  },
  errorComponent: ErrorComponent,
  notFoundComponent: () => {
    return (
      <ErrorComponent
        error={{ name: 'Not Found', message: 'Page not found' }}
        reset={() => {}}
      />
    );
  },
});
