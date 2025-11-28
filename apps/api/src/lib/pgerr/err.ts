import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError } from "pg";

export function isPgError(error: unknown): error is { cause: DatabaseError } {
  if (error instanceof DrizzleQueryError) {
    if (error.cause instanceof DatabaseError) {
      return true;
    }
  }

  return false;
}
