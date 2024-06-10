import { render } from "@react-email/render";
import { createTransport } from "nodemailer";
import {
  SendReportCreatedEmailPayload,
  SendWelcomeEmailPayload,
} from "../common";
import { ReportCreatedEmail } from "./emails/report-created";
import { WelcomeEmail } from "./emails/welcome";

const transporter = createTransport({
  host: Bun.env["SMTP_HOST"],
  port: +(Bun.env["SMTP_PORT"] ?? 0),
  secure: true,
  auth: {
    user: Bun.env["AUTH_USER"],
    pass: Bun.env["AUTH_PASSWORD"],
  },
});

export function sendWelcomeEmail(payload: SendWelcomeEmailPayload) {
  return transporter.sendMail({
    from: Bun.env["FROM_EMAIL"],
    to: payload.to,
    subject: "Welcome to Wanderlust",
    html: render(WelcomeEmail({ name: payload.name })),
  });
}

export function sendReportCreatedEmail(payload: SendReportCreatedEmailPayload) {
  return transporter.sendMail({
    from: Bun.env["FROM_EMAIL"],
    to: payload.to,
    subject: "We have received your report!",
    html: render(ReportCreatedEmail()),
  });
}
