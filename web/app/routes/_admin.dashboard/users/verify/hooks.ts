import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { makeUserVerified } from "~/lib/api";

export function useVerifyUserMutation() {
  return useMutation({
    mutationKey: ["user-verify"],
    mutationFn: async (username: string) => makeUserVerified(username),
    onSuccess: () => {
      toast.success("User is verified");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
