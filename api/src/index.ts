import * as handler from "@/routes/handler";
import { Elysia } from "elysia";
import { bootstrapServices } from "./services";
import { createContext } from "./lib/context";
import { ConfigServiceProvider } from "./lib/config";

async function main() {
  const ioc = await bootstrapServices();
  const config = ioc.resolve(ConfigServiceProvider.getIdentifier());

  new Elysia()
    .all("/rpc*", async (ctx) => {
      const res = await handler.rpc.handle(ctx.request, {
        prefix: "/rpc",
        context: await createContext({ context: ctx, ioc }),
      });

      return res ?? new Response("Not Found", { status: 404 });
    })
    .all("/api*", async (ctx) => {
      const res = await handler.api.handle(ctx.request, {
        prefix: "/api",
        context: await createContext({ context: ctx, ioc }),
      });

      return res ?? new Response("Not Found", { status: 404 });
    })
    .listen(config.api.port, () => {
      console.log(`Server is running on http://localhost:${config.api.port}`);
    });
}

await main();
