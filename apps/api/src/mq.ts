import amqplib from "amqplib";

export const mq = await amqplib.connect("amqp://localhost");

export async function sendWelcomeEmail(to: string, name: string) {
  console.log("Sending email payload to queue");

  const queue = "welcome-email";
  const ch = await mq.createChannel();
  await ch.assertQueue(queue);

  const payload = {
    to,
    name,
  };

  return ch.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
}
