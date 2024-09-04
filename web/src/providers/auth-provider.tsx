'use client';

import api from '@/lib/api';
import { Auth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import React, { PropsWithChildren, useMemo } from 'react';

type AuthContextState = {
  isLoading: boolean;
  user: Auth | null;
};

export const AuthContext = React.createContext<AuthContextState>({
  isLoading: true,
  user: null,
});

export default function AuthContextProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const query = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const res = await api.get('auth/me');
      return res.json<Auth>();
    },
    retry: false,
  });

  const v = useMemo(
    () => ({
      isLoading: query.isLoading,
      user: query.data || null,
    }),
    [query.data, query.isLoading]
  );

  return <AuthContext.Provider value={v}>{children}</AuthContext.Provider>;
}
