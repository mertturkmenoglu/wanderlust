import { useUser } from "@clerk/nextjs";

export function useIsThisUser(username: string): boolean {
  const user = useUser();

  return user.user?.username === username;
}
