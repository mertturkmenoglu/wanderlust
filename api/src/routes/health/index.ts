import { implement } from "@orpc/server";
import type { Context } from "@/lib/context";
import { contract } from "./contract";

const os = implement(contract).$context<Context>();

export const router = os.router({
  check: os.check.handler(async () => {
    return {
      message: "OK",
    };
  }),
});
