import { WebhookEvent } from "@clerk/backend";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { Webhook } from "svix";
import {
  handleUserCreate,
  handleUserDelete,
  handleUserUpdate,
} from "../../db/handle-user-sync";
import { UserEventType, sendUserEvent, sendWelcomeEmail } from "../../mq";
import { Env, env } from "../../start";

const factory = createFactory<Env>();

const root = factory.createHandlers(async (c) => {
  // Get the Svix headers for verification
  const svix_id = c.req.header("svix-id");
  const svix_timestamp = c.req.header("svix-timestamp");
  const svix_signature = c.req.header("svix-signature");

  // If there are no Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new HTTPException(400, {
      message: "Error occured -- no svix headers",
    });
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If the verification fails, error out and  return error code
  try {
    const payload = await c.req.raw.text();
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err: any) {
    console.log("Error verifying webhook:", err.message);
    throw new HTTPException(400, {
      message: err.message,
    });
  }

  // Do something with the payload
  const { id } = evt.data;
  const eventType = evt.type;

  let user: Awaited<ReturnType<typeof handleUserCreate>> = null;

  try {
    if (eventType === "user.created") {
      user = await handleUserCreate(evt.data);
    } else if (eventType === "user.updated") {
      user = await handleUserUpdate(evt.data);
    } else if (eventType === "user.deleted") {
      user = await handleUserDelete(evt.data);
    } else {
      console.log(`Different event: ${id} - ${eventType}`);
      console.log(evt.data);
    }

    if (user) {
      if (evt.type === "user.created") {
        await sendWelcomeEmail({
          name: user.firstName ?? "",
          to: evt.data.email_addresses[0]?.email_address ?? "",
        });
      }

      const type = evt.type.replace(".", "-") as UserEventType;
      await sendUserEvent(type, user);
    }

    return c.json(
      {
        success: true,
        message: "Webhook received",
      },
      200
    );
  } catch (e) {
    console.error(e);
    return c.json(
      {
        success: false,
        message: "Something went wrong",
      },
      500
    );
  }
});

export const webhooksRouter = new Hono().post("/", ...root);
