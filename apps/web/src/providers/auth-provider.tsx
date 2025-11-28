import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import React, { type PropsWithChildren } from 'react';

type AuthContextState = {
  isLoading: boolean;
  user: components['schemas']['GetMeOutputBody'] | null;
};

const AuthContext = React.createContext<AuthContextState>({
  isLoading: true,
  user: null,
});

function AuthContextProvider({ children }: Readonly<PropsWithChildren>) {
  const query = useQuery(
    api.queryOptions(
      'get',
      '/api/v2/auth/me',
      {},
      {
        retry: false,
        cacheTime: Infinity,
        refetchInterval: Infinity,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    ),
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
