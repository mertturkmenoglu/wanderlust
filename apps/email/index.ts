import * as amqplib from "amqplib";
import { MQEventPayload, MQQueue } from "../common";
import { sendReportCreatedEmail, sendWelcomeEmail } from "./send";

async function consumer() {
  const conn = await amqplib.connect("amqp://localhost");
  const queue: MQQueue = "email";
  const ch = await conn.createChannel();
  await ch.assertQueue(queue);

  await ch.consume(queue, (msg) => {
    if (msg !== null) {
      ch.ack(msg);
      router(msg);
    } else {
      console.log("Consumer cancelled by server");
    }
  });
}

function router(msg: amqplib.ConsumeMessage) {
  const str = msg.content.toString();
  const payload = JSON.parse(str) as MQEventPayload;

  switch (payload.type) {
    case "send-welcome-email":
      sendWelcomeEmail(payload.payload);
      break;
    case "report-created":
      sendReportCreatedEmail(payload.payload);
      break;
    default:
      console.log("Unknown event type");
      break;
  }
}

consumer();
