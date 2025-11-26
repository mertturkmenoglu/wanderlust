import type { Context as ElysiaContext } from "elysia";
import type { Container } from "../di";
import { AuthServiceProvider } from "../auth";

export type CreateContextOptions = {
  context: ElysiaContext;
  ioc: Container;
};

export async function createContext({ context, ioc }: CreateContextOptions) {
  const auth = ioc.resolve(AuthServiceProvider.getIdentifier());

  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  return {
    session,
    ioc,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export type AuthContext = {
  session: NonNullable<Context["session"]>;
};
