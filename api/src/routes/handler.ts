import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { getAppRouter } from ".";

export function getApiHandler() {
  const appRouter = getAppRouter();

  return new OpenAPIHandler(appRouter, {
    plugins: [
      new OpenAPIReferencePlugin({
        docsProvider: "scalar",
        schemaConverters: [new ZodToJsonSchemaConverter()],
        docsTitle: "Wanderlust API Documentation",
        specGenerateOptions: {
          info: {
            title: "Wanderlust API",
            version: "3.0.0",
            description: "API documentation for the Wanderlust application.",
            license: {
              name: "MIT",
              url: "https://opensource.org/license/mit/",
            },
            summary:
              "Wanderlust is a travel planning application that helps users organize and manage their trips effectively.",
          },
        },
      }),
    ],
    interceptors: [
      onError((error) => {
        console.error(error);
      }),
    ],
  });
}

export function getRpcHandler() {
  const appRouter = getAppRouter();

  return new RPCHandler(appRouter, {
    interceptors: [
      onError((error) => {
        console.error(error);
      }),
    ],
  });
}
