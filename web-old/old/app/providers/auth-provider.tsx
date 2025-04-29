import { useQuery } from "@tanstack/react-query";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import api from "~/lib/api";
import { AuthDto } from "~/lib/dto";

type AuthContextState = {
  isLoading: boolean;
  user: AuthDto | null;
};

export const AuthContext = React.createContext<AuthContextState>({
  isLoading: true,
  user: null,
});

export default function AuthContextProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const query = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const res = await api.get("auth/me");
      return res.json<AuthDto>();
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

  useEffect(() => {
    const path = window.location.pathname;

    if (v.user !== null) {
      if (!v.user.data.isOnboardingCompleted && path !== "/onboarding") {
        window.location.href = "/onboarding";
      } else if (
        !v.user.data.isEmailVerified &&
        path !== "/onboarding" &&
        path !== "/verify-email"
      ) {
        window.location.href = "/verify-email";
      }
    }
  }, [v.user]);

  return <AuthContext.Provider value={v}>{children}</AuthContext.Provider>;
}
