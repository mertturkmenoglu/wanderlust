import type { SocketAddress } from "bun";
import { AuthUser, User } from "../db/schema";

export type Env = {
  Variables: {
    auth: AuthUser;
    withAuth?: AuthUser | undefined;
    user: User;
  };
  Bindings: {
    ip: SocketAddress;
  };
};
