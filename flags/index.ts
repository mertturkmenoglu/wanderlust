type Flags = {
  version: string;
  flags: Record<string, any>;
};

const devFlags = {
  version: "v2",
  flags: {
    "redirect-to-wip": false,
    "app-bar-show-wip-icons": true,
    "allow-oauth-logins": true,
  },
} satisfies Flags;

async function main() {
  const isDev = process.env.NODE_ENV === "development";

  let flags: Flags = devFlags;

  if (isDev) {
    flags = devFlags;
  } else {
    const obj = (await Bun.file("flags.json").json()) as Flags;
    flags = obj;
  }

  Bun.serve({
    port: process.env.PORT ? Number(process.env.PORT) : 5001,
    routes: {
      "/flags": {
        GET: () => {
          return new Response(JSON.stringify(flags), {
            headers: { "Content-Type": "application/json" },
          });
        },
        POST: async (req) => {
          const apiKeyHeader = req.headers.get("x-api-key");

          if (
            !crypto.timingSafeEqual(
              Buffer.from(apiKeyHeader || ""),
              Buffer.from(process.env.API_KEY || "")
            )
          ) {
            return new Response(
              JSON.stringify({ message: "Invalid API key" }),
              { status: 403 }
            );
          }

          const body = await req.json();
          flags = body as Flags;
          await Bun.file("flags.json").write(JSON.stringify(flags));
          return new Response(
            JSON.stringify({ message: "Flags updated successfully" }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        },
      },
    },
  });
}
