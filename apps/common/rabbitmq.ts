export type MQEventType =
  | "send-welcome-email"
  | "lorem-ipsum"
  | "lorem-ipsum-2"
  | "lorem-ipsum-3";

export type MQEventPayload =
  | {
      type: "send-welcome-email";
      payload: SendWelcomeEmailPayload;
    }
  | {
      type: "lorem-ipsum";
      payload: any;
    }
  | {
      type: "lorem-ipsum-2";
      payload: any;
    }
  | {
      type: "lorem-ipsum-3";
      payload: any;
    };

export type MQQueue =
  | "email"
  | "lorem-ipsum"
  | "lorem-ipsum-2"
  | "lorem-ipsum-3";

export type SendWelcomeEmailPayload = {
  to: string;
  name: string;
};
