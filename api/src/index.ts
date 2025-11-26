import { getApiHandler, getRpcHandler } from "@/routes/handler";
import { createContext } from "./lib/context";
import { bootstrapServices, ioc } from "./ioc";
import { ConfigProvider } from "./lib/config";

async function main() {
  await bootstrapServices();

  const config = ioc.resolve(ConfigProvider.id);

  const api = getApiHandler();
  const rpc = getRpcHandler();

  const server = Bun.serve({
    port: config.api.port,
    async fetch(request) {
      const url = new URL(request.url);
      const isRpcRequest = url.pathname.startsWith("/rpc");
      const handler = isRpcRequest ? rpc : api;
      const prefix = isRpcRequest ? "/rpc" : "/api";

      const res = await handler.handle(request, {
        prefix,
        context: await createContext({ request, ioc }),
      });

      if (res.matched) {
        return res.response;
      }

      return new Response("Not Found", { status: 404 });
    },
  });

  console.log(`Server running on ${server.hostname}:${server.port}`);
}

await main();
