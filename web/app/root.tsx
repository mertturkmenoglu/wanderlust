import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Header from "./components/blocks/header";
import { Toaster } from "./components/ui/sonner";
import AuthContextProvider from "./providers/auth-provider";
import "./tailwind.css";

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
            <Toaster />
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
    </div>
  );
}
