import { env } from '@/lib/env';
import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';

export type FlagsResponse = {
  version: string;
  flags: Record<string, string | boolean | number>;
};

export type FlagsContextState = {
  flags: FlagsResponse;
};

export const FlagsContext = React.createContext<FlagsContextState>({
  flags: {
    flags: {},
    version: '',
  },
});

export function FlagsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const query = useSuspenseQuery({
    queryKey: ['flags'],
    queryFn: async () => {
      const baseUrl = env.VITE_FLAGS_SERVICE_URL;
      const res = await fetch(`${baseUrl}/flags`);
      const data = (await res.json()) as FlagsResponse;
      return data;
    },
  });

  return (
    <FlagsContext.Provider
      value={{
        flags: query.data,
      }}
    >
      {children}
    </FlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const ctx = useContext(FlagsContext);

  if (!ctx) {
    throw new Error('useFeatureFlags must be used within a FlagsProvider');
  }

  return ctx.flags.flags;
}
