import type { SocketAddress } from "bun";
import { AuthUser } from "./db/schema";

export type Env = {
  Variables: {
    auth: AuthUser;
    withAuth?: AuthUser | undefined;
  };
  Bindings: {
    ip: SocketAddress;
  };
};
