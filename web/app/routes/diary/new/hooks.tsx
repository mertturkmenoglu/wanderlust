import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { FormInput, schema } from "./schema";

export function useNewDiaryEntryForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      shareWithFriends: false,
      locations: [],
      friendSearch: "",
    },
  });
}

export type FormType = UseFormReturn<FormInput, any, undefined>;
