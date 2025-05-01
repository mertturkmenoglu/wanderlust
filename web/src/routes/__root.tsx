import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import TanstackQueryLayout from '../integrations/tanstack-query/layout';

import Footer from '@/components/blocks/footer';
import Header from '@/components/blocks/header';
import AuthContextProvider from '@/providers/auth-provider';
import type { QueryClient } from '@tanstack/react-query';
import { Toaster } from 'sonner';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <AuthContextProvider>
      <div>
        <Header />
        <Outlet />
        <Footer />
        <TanStackRouterDevtools />
        <TanstackQueryLayout />
        <Toaster />
      </div>
    </AuthContextProvider>
  ),
});
