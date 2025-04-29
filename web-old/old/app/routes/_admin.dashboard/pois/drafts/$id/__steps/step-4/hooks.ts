import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Draft } from "~/lib/dto";
import { FormInput, schema } from "./schema";

export function useStep4Form(draft: Draft) {
  return useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      openTimes: {
        mon: {
          open: draft.openTimes?.mon?.open ?? undefined,
          close: draft.openTimes?.mon?.close ?? undefined,
          closed: draft.openTimes?.mon?.closed ?? undefined,
        },
        tue: {
          open: draft.openTimes?.tue?.open ?? undefined,
          close: draft.openTimes?.tue?.close ?? undefined,
          closed: draft.openTimes?.tue?.closed ?? undefined,
        },
        wed: {
          open: draft.openTimes?.wed?.open ?? undefined,
          close: draft.openTimes?.wed?.close ?? undefined,
          closed: draft.openTimes?.wed?.closed ?? undefined,
        },
        thu: {
          open: draft.openTimes?.thu?.open ?? undefined,
          close: draft.openTimes?.thu?.close ?? undefined,
          closed: draft.openTimes?.thu?.closed ?? undefined,
        },
        fri: {
          open: draft.openTimes?.fri?.open ?? undefined,
          close: draft.openTimes?.fri?.close ?? undefined,
          closed: draft.openTimes?.fri?.closed ?? undefined,
        },
        sat: {
          open: draft.openTimes?.sat?.open ?? undefined,
          close: draft.openTimes?.sat?.close ?? undefined,
          closed: draft.openTimes?.sat?.closed ?? undefined,
        },
        sun: {
          open: draft.openTimes?.sun?.open ?? undefined,
          close: draft.openTimes?.sun?.close ?? undefined,
          closed: draft.openTimes?.sun?.closed ?? undefined,
        },
      },
    },
  });
}
