import { useAuth } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export function canAccessOrg(): boolean {
  const { orgId } = auth();
  return orgId === process.env.CLERK_ADMIN_ORG_ID;
}

export function useCanAccessOrg(): boolean {
  const { orgId } = useAuth();
  console.log({ orgId, env: process.env.CLERK_ADMIN_ORG_ID });
  return orgId !== undefined && orgId === process.env.CLERK_ADMIN_ORG_ID;
}
