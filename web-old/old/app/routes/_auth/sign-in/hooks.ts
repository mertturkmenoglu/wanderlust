import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api, { isApiError } from "~/lib/api";
import { ErrorResponse } from "~/lib/dto";
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
    onError: async (e) => {
      if (isApiError(e)) {
        const res = await e.response.json<ErrorResponse>();
        const msg = res.errors[0].title;
        const fmt = msg[0].toUpperCase() + msg.slice(1);
        toast.error(fmt);
      } else {
        toast.error("Something went wrong");
      }
    },
  });
}
