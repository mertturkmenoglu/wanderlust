import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode, useContext } from 'react';
import ReactDOM from 'react-dom/client';

import * as TanstackQuery from './integrations/tanstack-query/root-provider';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

import 'instantsearch.css/themes/reset.css';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';
import { Spinner } from './components/kit/spinner.tsx';
import {
  AuthContext,
  AuthContextProvider,
} from './providers/auth-provider.tsx';
import {
  FlagsContext,
  FlagsContextProvider,
} from './providers/flags-provider.tsx';
import reportWebVitals from './reportWebVitals.ts';
import './styles.css';

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    ...TanstackQuery.getContext(),
    // oxlint-disable-next-line no-non-null-assertion
    auth: undefined!,
    // oxlint-disable-next-line no-non-null-assertion
    flags: undefined!,
  },
  defaultPreload: false,
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <FlagsContextProvider>
      <AuthContextProvider>
        <InnerApp />
      </AuthContextProvider>
    </FlagsContextProvider>
  );
}

function InnerApp() {
  const auth = useContext(AuthContext);
  const flags = useContext(FlagsContext);

  if (auth.isLoading && !auth.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="fill-primary text-gray-200 size-12 animate-spin" />
      </div>
    );
  }

  return (
    <RouterProvider
      router={router}
      context={{ auth, flags: flags.flags }}
    />
  );
}

// Render the app
const rootElement = globalThis.document.querySelector('#app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanstackQuery.Provider>
        <App />
      </TanstackQuery.Provider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
