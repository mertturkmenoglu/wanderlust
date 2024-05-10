import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import { getAuth } from "../middlewares/get-auth";

const app = new Hono().get("/", clerkMiddleware(), getAuth, async (c) => {
  return c.json({
    message: "You are logged in!",
    auth: c.get("auth"),
  });
});

export default app;
