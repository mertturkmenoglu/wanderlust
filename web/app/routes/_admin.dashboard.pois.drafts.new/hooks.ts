import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import * as collapsible from "@zag-js/collapsible";
import * as fileUpload from "@zag-js/file-upload";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { getCities } from "~/lib/api";
import { FormInput, schema } from "./schema";

export function useNewPoiForm() {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
  });
}

export function useCitiesQuery() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => getCities(),
  });
}

export function useUpload() {
  const [cstate, csend] = useMachine(collapsible.machine({ id: useId() }));
  const capi = collapsible.connect(cstate, csend, normalizeProps);
  const [fstate, fsend] = useMachine(
    fileUpload.machine({
      id: useId(),
      accept: "image/*",
      maxFiles: 10,
      maxFileSize: 1024 * 1024 * 10, // 10MB
    })
  );
  const fapi = fileUpload.connect(fstate, fsend, normalizeProps);
  return [capi, fapi] as const;
}
