import type { Container } from "../di";
import { AuthProvider } from "../auth";

export type CreateContextOptions = {
  request: Request;
  ioc: Container;
};

export async function createContext({ request, ioc }: CreateContextOptions) {
  const auth = ioc.resolve(AuthProvider.id);

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return {
    session,
    ioc,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export type AuthContext = {
  session: NonNullable<Context["session"]>;
  ioc: Container;
};
