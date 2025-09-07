import React, { use, useState, type PropsWithChildren } from "react";

type AuthContextState = {
  isLoading: boolean;
  user: { id: string; name: string } | null;
};

const AuthContext = React.createContext<AuthContextState>({
  isLoading: true,
  user: null,
});

function AuthContextProvider({ children }: Readonly<PropsWithChildren>) {
  // TODO: Replace with your own API call
  const [isLoading] = useState(true);
  const [user] = useState<AuthContextState["user"]>(
    /*{
    id: "1",
    name: "John Doe",
  } */ null
  );

  return (
    <AuthContext.Provider
      value={{
        isLoading: isLoading,
        user: user,
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
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}
