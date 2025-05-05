import { DevTool } from "@hookform/devtools";
import { Uppy } from "@uppy/core";
import GoldenRetriever from "@uppy/golden-retriever";
import ImageEditor from "@uppy/image-editor/lib/ImageEditor";
import { useState } from "react";
import { data, redirect, useBlocker } from "react-router";
import BackLink from "~/components/blocks/back-link";
import { getMe } from "~/lib/api";
import Step1 from "./components/step1";
import Step2 from "./components/step2";
import Step3 from "./components/step3";
import Step4 from "./components/step4";
import Step5 from "./components/step5";
import { useNewDiaryEntryForm, useSaveToLocalStorage } from "./hooks";

import uppyCoreStyles from "@uppy/core/dist/style.min.css?url";
import uppyDashboardStyles from "@uppy/dashboard/dist/style.min.css?url";
import uppyFileInputStyles from "@uppy/file-input/dist/style.css?url";
import uppyImageEditorStyles from "@uppy/image-editor/dist/style.min.css?url";
import { FormProvider, useFormState } from "react-hook-form";
import AppMessage from "~/components/blocks/app-message";

import { SaveIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Route } from "./+types/route";
import UnsavedChanges from "./components/unsaved-tooltip";

export async function clientLoader() {
  try {
    const auth = await getMe();

    if (!auth.data) {
      throw data("You are not signed in", {
        status: 401,
      });
    }
  } catch (e) {
    const status = (e as any)?.response?.status;

    if (status === 401) {
      throw redirect("/");
    } else {
      throw data("Something went wrong", {
        status: status ?? 500,
      });
    }
  }

  const baseApiUrl = import.meta.env.VITE_API_URL ?? "";
  return { baseApiUrl };
}

export function HydrateFallback() {
  return (
    <div className="max-w-7xl mx-auto my-32">
      <AppMessage emptyMessage="Loading..." showBackButton={false} />
    </div>
  );
}

export function meta(): Route.MetaDescriptors {
  return [{ title: "New Diary Entry | Wanderlust" }];
}

export function links(): Route.LinkDescriptors {
  return [
    { rel: "stylesheet", href: uppyCoreStyles },
    { rel: "stylesheet", href: uppyDashboardStyles },
    { rel: "stylesheet", href: uppyFileInputStyles },
    { rel: "stylesheet", href: uppyImageEditorStyles },
  ];
}

clientLoader.hydrate = true as const;

export default function Page({ loaderData }: Route.ComponentProps) {
  const { baseApiUrl } = loaderData;
  const form = useNewDiaryEntryForm();
  const state = useFormState(form);
  const { saveStatus, saveText, saveToLocalStorage } =
    useSaveToLocalStorage(form);
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        allowedFileTypes: [".jpg", ".jpeg", ".png"],
        maxNumberOfFiles: 10,
        maxFileSize: 5 * 1024 * 1024,
      },
    })
      .use(ImageEditor)
      .use(GoldenRetriever, { expires: 7 * 24 * 60 * 60 * 1000 })
      .on("file-added", (file) => {
        console.log("file added", file);
      })
      .on("complete", () => {
        console.log("complete");
      })
  );

  // Block navigating elsewhere when data has been entered into the input
  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      state.isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  return (
    <>
      <FormProvider {...form}>
        <div className="max-w-7xl mx-auto my-8">
          <BackLink href="/diary" text="Go back to your diary" />

          <Tabs defaultValue="1" className="mt-8 max-w-xl mx-auto">
            <div className="w-full flex">
              <TabsList className="w-full">
                <TabsTrigger value="1">Info</TabsTrigger>
                <TabsTrigger value="2">Locations</TabsTrigger>
                <TabsTrigger value="3">Friends</TabsTrigger>
                <TabsTrigger value="4">Media</TabsTrigger>
                <TabsTrigger value="5">Review</TabsTrigger>
              </TabsList>
            </div>

            <div className="my-4 grid grid-cols-2 items-center">
              <div>
                {state.isDirty ? (
                  <UnsavedChanges />
                ) : saveStatus !== "idle" ? (
                  <div>{saveText}</div>
                ) : (
                  <></>
                )}
              </div>
              <button
                className="ml-auto px-4 py-2 hover:bg-muted rounded text-secondary-foreground text-sm flex items-center gap-2"
                disabled={saveStatus !== "idle"}
                onClick={() => saveToLocalStorage()}
              >
                <SaveIcon className="size-4" />
                <span>{saveText}</span>
              </button>
            </div>

            <TabsContent value="1">
              <Step1 />
            </TabsContent>
            <TabsContent value="2">
              <Step2 />
            </TabsContent>
            <TabsContent value="3">
              <Step3 />
            </TabsContent>
            <TabsContent value="4">
              <Step4 uppy={uppy} />
            </TabsContent>
            <TabsContent value="5">
              <Step5 uppy={uppy} baseApiUrl={baseApiUrl} />
            </TabsContent>
          </Tabs>
        </div>
      </FormProvider>
      <DevTool control={form.control} />

      {blocker.state === "blocked" ? (
        <AlertDialog open={blocker.state === "blocked"}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="grid gap-4 py-2">
              You have unsaved changes. You will lose your progress. Do you want
              to proceed?
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => blocker.reset()}>
                No
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => blocker.proceed()}>
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </>
  );
}
