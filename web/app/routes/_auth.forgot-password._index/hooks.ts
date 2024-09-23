import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "~/lib/api";
import { FormInput, FormSchema } from "./schema";

export function useForgotPasswordForm() {
  return useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });
}

export function useForgotPasswordMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (data: FormInput) => {
      await api.post("auth/forgot-password/send", {
        json: {
          email: data.email,
        },
      });
    },
    onSuccess: (_, variables) => {
      window.sessionStorage.setItem("forgot-password-email", variables.email);
      navigate("/forgot-password/reset");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
