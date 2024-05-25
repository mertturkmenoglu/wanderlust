import amqplib from "amqplib";
import {
  MQEventPayload,
  MQEventType,
  MQQueue,
  SendWelcomeEmailPayload,
} from "../../common";

export const mq = await amqplib.connect("amqp://localhost");

function serialize(payload: MQEventPayload) {
  return Buffer.from(JSON.stringify(payload));
}

async function getChannel(q: MQQueue) {
  const ch = await mq.createChannel();
  await ch.assertQueue(q);
  return [q, ch] as const;
}

export async function sendWelcomeEmail(payload: SendWelcomeEmailPayload) {
  const [q, ch] = await getChannel("email");

  return ch.sendToQueue(
    q,
    serialize({
      type: "send-welcome-email",
      payload,
    }),
  );
}

export type UserEventType = Extract<
  MQEventType,
  "user-created" | "user-updated" | "user-deleted"
>;
type UserPayload = (MQEventPayload & { type: UserEventType })["payload"];

export async function sendUserEvent(type: UserEventType, payload: UserPayload) {
  const [q, ch] = await getChannel("user");

  return ch.sendToQueue(
    q,
    serialize({
      type,
      payload,
    }),
  );
}
