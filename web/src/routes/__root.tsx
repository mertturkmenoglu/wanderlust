import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import TanstackQueryLayout from '../integrations/tanstack-query/layout';

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
      <body className="mx-4 md:mx-8 lg:mx-16 2xl:mx-32">
        <Header />
        <Outlet />
        <TanStackRouterDevtools />
        <TanstackQueryLayout />
        <Toaster />
      </body>
    </AuthContextProvider>
  ),
});
