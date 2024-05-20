import { AuthUser } from "@/db/schema";

import type { SocketAddress } from "bun";

export type Env = {
  Variables: {
    auth: AuthUser;
    withAuth?: AuthUser | undefined;
  };
  Bindings: {
    ip: SocketAddress;
  };
};
