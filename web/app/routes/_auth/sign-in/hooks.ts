import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "~/lib/api";
import { FormInput, FormSchema } from "./schema";

export function useSignInForm() {
  return useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: FormInput) => {
      await api.post("auth/credentials/login", {
        json: data,
      });
    },
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
