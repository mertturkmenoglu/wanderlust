import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import TanstackQueryLayout from '../integrations/tanstack-query/layout';

import AppMessage from '@/components/blocks/app-message';
import Footer from '@/components/blocks/footer';
import Header from '@/components/blocks/header';
import { isApiError } from '@/lib/api';
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
        <Toaster position="bottom-center" richColors />
      </div>
    </AuthContextProvider>
  ),
  errorComponent: ({ error }) => {
    let msg = (() => {
      if (isApiError(error)) {
        if (error.detail) {
          return error.detail;
        }

        if (error.title) {
          return error.title;
        }
      }

      return 'Something went wrong';
    })();

    return (
      <AuthContextProvider>
        <Header />
        <div className="flex flex-col items-center justify-center">
          <AppMessage
            errorMessage={msg}
            showBackButton={true}
            backLink="/"
            backLinkText="Go back to the home page"
            className="my-32"
          />
        </div>
      </AuthContextProvider>
    );
  },
  notFoundComponent: () => {
    return (
      <div>
        <AppMessage
          errorMessage="Page not found"
          showBackButton={true}
          backLink="/"
          backLinkText="Go back to the home page"
          className="my-16"
        />
      </div>
    );
  },
});
