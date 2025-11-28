import { TaggedError } from "../err";

export class ConfigFileValidationError extends TaggedError(
  "ConfigFileValidationError"
) {}
