import type { LinksFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { GeneralErrorBoundary } from "./components/blocks/error-boundary";
import Footer from "./components/blocks/footer";
import Header from "./components/blocks/header";
import { Toaster } from "./components/ui/sonner";
import AuthContextProvider from "./providers/auth-provider";
import sonnerStyles from "./sonner.css?url";
import tw from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: tw },
  { rel: "stylesheet", href: sonnerStyles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={"mx-4 md:mx-8 lg:mx-16 2xl:mx-32"}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            {children}
            <ScrollRestoration />
            <Scripts />
            <ReactQueryDevtools />
          </AuthContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
      <Toaster position="bottom-center" richColors />
    </div>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
