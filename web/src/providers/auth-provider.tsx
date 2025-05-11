import { api } from '@/lib/api';
import type { components } from '@/lib/api-types';
import { useQuery } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useMemo } from 'react';

export type AuthContextState = {
  isLoading: boolean;
  user: components['schemas']['GetMeOutputBody'] | null;
};

export const AuthContext = React.createContext<AuthContextState>({
  isLoading: true,
  user: null,
});

export default function AuthContextProvider({
  children,
}: Readonly<PropsWithChildren>) {
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

  const v = useMemo(() => {
    return {
      isLoading: query.isLoading,
      user: query.data || null,
    };
  }, [query.data, query.isLoading]);

  useEffect(() => {
    const path = window.location.pathname;

    if (v.user !== null) {
      if (!v.user.isOnboardingCompleted && path !== '/onboarding') {
        window.location.href = '/onboarding';
      } else if (
        !v.user.isEmailVerified &&
        path !== '/onboarding' &&
        path !== '/verify-email'
      ) {
        window.location.href = '/verify-email';
      }
    }
  }, [v.user]);

  return <AuthContext.Provider value={v}>{children}</AuthContext.Provider>;
}
