import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Webhook } from "svix";
import env from "../env";
import { DeletedObjectJSON, UserJSON, WebhookEvent } from "@clerk/backend";
import { db } from "../db";
import { auths, users } from "../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.post("/", async (c) => {
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

  try {
    if (eventType === "user.created") {
      await handleUserCreate(evt.data);
    } else if (eventType === "user.updated") {
      await handleUserUpdate(evt.data);
    } else if (eventType === "user.deleted") {
      await handleUserDelete(evt.data);
    } else {
      console.log(`Different event: ${id} - ${eventType}`);
      console.log(evt.data);
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

async function handleUserCreate(data: UserJSON): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      const [user] = await tx.insert(users).values({}).returning();
      await tx.insert(auths).values({
        clerkId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email_addresses[0]?.email_address,
        emailId: data.email_addresses[0]?.id,
        emailVerification: data.email_addresses[0]?.verification?.status,
        lastSignInAt: data.last_sign_in_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        username: data.username,
        image: data.image_url,
        userId: user.id,
      });
    });
  } catch (e) {
    console.error(e);
  }
}

async function handleUserUpdate(data: UserJSON): Promise<void> {
  try {
    await db
      .update(auths)
      .set({
        clerkId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email_addresses[0]?.email_address,
        emailId: data.email_addresses[0]?.id,
        emailVerification: data.email_addresses[0]?.verification?.status,
        lastSignInAt: data.last_sign_in_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        username: data.username,
        image: data.image_url,
      })
      .where(eq(auths.clerkId, data.id));
  } catch (e) {
    console.error(e);
  }
}

async function handleUserDelete(data: DeletedObjectJSON): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      const clerkId = data.id;
      if (clerkId === undefined) {
        throw new Error("Clerk ID is undefined");
      }
      const [authObj] = await tx
        .delete(auths)
        .where(eq(auths.clerkId, clerkId))
        .returning();
      await tx.delete(users).where(eq(users.id, authObj.userId));
    });
  } catch (e) {
    console.error(e);
  }
}

export default app;
