export type MQEventType =
  | "send-welcome-email"
  | "user-created"
  | "user-updated"
  | "user-deleted";

export type MQEventPayload =
  | {
      type: "send-welcome-email";
      payload: SendWelcomeEmailPayload;
    }
  | {
      type: "user-created";
      payload: UserCreatedPayload;
    }
  | {
      type: "user-updated";
      payload: UserUpdatedPayload;
    }
  | {
      type: "user-deleted";
      payload: UserDeletedPayload;
    };

export type MQQueue = "email" | "user";

export type SendWelcomeEmailPayload = {
  to: string;
  name: string;
};

export type UserCreatedPayload = {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  isBusinessAccount: boolean;
  isVerified: boolean;
  bio: string | null;
  website: string | null;
  phone: string | null;
  followersCount: number;
  followingCount: number;
};

export type UserUpdatedPayload = UserCreatedPayload;

export type UserDeletedPayload = UserCreatedPayload;
