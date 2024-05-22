import amqplib from "amqplib";
import { MQEventPayload, MQQueue, SendWelcomeEmailPayload } from "../../common";

export const mq = await amqplib.connect("amqp://localhost");

function serialize(payload: MQEventPayload) {
  return Buffer.from(JSON.stringify(payload));
}

async function getEmailChannel() {
  const queue: MQQueue = "email";
  const ch = await mq.createChannel();
  await ch.assertQueue(queue);
  return [queue, ch] as const;
}

export async function sendWelcomeEmail(payload: SendWelcomeEmailPayload) {
  const [queue, ch] = await getEmailChannel();

  return ch.sendToQueue(
    queue,
    serialize({
      type: "send-welcome-email",
      payload,
    })
  );
}
