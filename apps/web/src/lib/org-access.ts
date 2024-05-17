import { auth } from "@clerk/nextjs/server";

export function canAccessOrg(): boolean {
  const { orgId } = auth();
  return orgId === process.env.CLERK_ADMIN_ORG_ID;
}
