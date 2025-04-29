export function getCookiesFromRequest(req: Request) {
  return req.headers.get("Cookie") ?? "";
}
