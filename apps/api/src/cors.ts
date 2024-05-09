export function getCorsConfig() {
  return {
    origin: Bun.env.CLIENT_ORIGIN ?? "",
    credentials: true,
    allowHeaders: ["Content-Type"],
    allowMethods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE", "PUT"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  };
}
