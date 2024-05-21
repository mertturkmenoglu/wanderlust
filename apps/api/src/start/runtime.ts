import { AuthUser, User } from "@/db/schema";

import type { SocketAddress } from "bun";

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
