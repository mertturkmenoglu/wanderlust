import { api } from "@/api/api";
import type { components } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import React, { use, type PropsWithChildren } from "react";

type AuthContextState = {
  isLoading: boolean;
  user: components["schemas"]["GetMeOutputBody"] | null;
};

const AuthContext = React.createContext<AuthContextState>({
  isLoading: true,
  user: null,
});

function AuthContextProvider({ children }: Readonly<PropsWithChildren>) {
  const query = useQuery(
    api.queryOptions(
      "get",
      "/api/v2/auth/me",
      {},
      {
        retry: false,
        refetchInterval: Infinity,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    )
  );

  return (
    <AuthContext.Provider
      value={{
        isLoading: query.isLoading,
        user: query.data || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider, type AuthContextState };

export function useSession() {
  const value = use(AuthContext);

  if (!value) {
    throw new Error("useSession must be wrapped in a <AuthContextProvider />");
  }

  return value;
}
