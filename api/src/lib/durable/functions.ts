// import { globalIoc } from "@/index";
// import * as email from "@/lib/email";
// import { DurableServiceProvider } from "./service";

// const client = globalIoc?.resolve(DurableServiceProvider.getIdentifier());

// const sendResetPasswordEmail = client.createFunction(
//   { id: "send-reset-password" },
//   { event: "emails/send-reset-password" },
//   async ({ event, step }) => {
//     await step.run("send-email", () => {
//       return email.client.sendMail({
//         from: cfg.email.from,
//         to: event.data.email,
//         subject: email.subjects.passwordReset,
//         html: email.templates.forgotPassword({
//           url: event.data.url,
//         }),
//       });
//     });
//   }
// );

export const functions = [
  // Add durable functions here
  // sendResetPasswordEmail,
];
