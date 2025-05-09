import {
  Outlet,
  createRootRouteWithContext,
  useSearch,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import TanstackQueryLayout from '../integrations/tanstack-query/layout';

import Footer from '@/components/blocks/footer';
import Header from '@/components/blocks/header';
import AuthContextProvider from '@/providers/auth-provider';
import type { QueryClient } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { SignInModal } from './_auth/sign-in/-modal';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const search = useSearch({ strict: false });

    return (
      <AuthContextProvider>
        <div>
          <Header />
          <Outlet />
          <Footer />
          <TanStackRouterDevtools />
          <TanstackQueryLayout />
          {search.signInModal && <SignInModal />}
          <Toaster position="bottom-center" richColors />
        </div>
      </AuthContextProvider>
    );
  },
});
