import { render } from "@react-email/render";
import * as amqplib from "amqplib";
import { createTransport } from "nodemailer";
import { WelcomeEmail } from "./emails/welcome";

async function sendEmail(to: string, name: string) {
  const transporter = createTransport({
    host: Bun.env["SMTP_HOST"],
    port: +(Bun.env["SMTP_PORT"] ?? 0),
    secure: true,
    auth: {
      user: Bun.env["AUTH_USER"],
      pass: Bun.env["AUTH_PASSWORD"],
    },
  });

  const emailHtml = render(WelcomeEmail({ name }));

  const options = {
    from: Bun.env["FROM_EMAIL"],
    to,
    subject: "Welcome to Wanderlust",
    html: emailHtml,
  };

  await transporter.sendMail(options);
}

(async () => {
  const queue = "welcome-email";
  const conn = await amqplib.connect("amqp://localhost");

  const ch = await conn.createChannel();
  await ch.assertQueue(queue);

  // Listener
  await ch.consume(queue, (msg) => {
    if (msg !== null) {
      console.log("Received:", msg.content.toString());
      const str = msg.content.toString();
      const payload = JSON.parse(str);
      ch.ack(msg);
      console.log("Sending email");
      sendEmail(payload.to, payload.name);
    } else {
      console.log("Consumer cancelled by server");
    }
  });
})();
