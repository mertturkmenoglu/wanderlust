import { useSession } from "@/providers/auth-context";

export function useUser() {
  const { user } = useSession();
  return user!;
}
