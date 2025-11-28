import { env } from '@/lib/env';
import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';

type FlagsResponse = {
  version: string;
  flags: Record<string, string | boolean | number>;
};

type FlagsContextState = {
  flags: FlagsResponse;
};

const FlagsContext = React.createContext<FlagsContextState>({
  flags: {
    flags: {},
    version: '',
  },
});

function FlagsContextProvider({ children }: { children: React.ReactNode }) {
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

function useFeatureFlags() {
  const ctx = useContext(FlagsContext);

  if (!ctx) {
    throw new Error('useFeatureFlags must be used within a FlagsProvider');
  }

  return ctx.flags.flags;
}

export {
  FlagsContext,
  FlagsContextProvider,
  useFeatureFlags,
  type FlagsContextState,
  type FlagsResponse,
};
