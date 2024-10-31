import { DevTool } from "@hookform/devtools";
import { json, redirect, useBlocker, useLoaderData } from "@remix-run/react";
import { Uppy } from "@uppy/core";
import GoldenRetriever from "@uppy/golden-retriever";
import ImageEditor from "@uppy/image-editor/lib/ImageEditor";
import { useState } from "react";
import BackLink from "~/components/blocks/back-link";
import { getMe } from "~/lib/api";
import EntryTitle from "./__components/entry-title";
import Nav from "./__components/nav";
import Step1 from "./__components/step1";
import Step2 from "./__components/step2";
import Step3 from "./__components/step3";
import Step4 from "./__components/step4";
import Step5 from "./__components/step5";
import Stepper from "./__components/stepper";
import { useNewDiaryEntryForm, useSaveToLocalStorage } from "./hooks";
import { steps } from "./steps";

import uppyCoreStyles from "@uppy/core/dist/style.min.css?url";
import uppyDashboardStyles from "@uppy/dashboard/dist/style.min.css?url";
import uppyFileInputStyles from "@uppy/file-input/dist/style.css?url";
import uppyImageEditorStyles from "@uppy/image-editor/dist/style.min.css?url";
import { FormProvider, useFormState } from "react-hook-form";
import AppMessage from "~/components/blocks/app-message";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export async function clientLoader() {
  try {
    const auth = await getMe();

    if (!auth.data) {
      throw json("You are not signed in", {
        status: 401,
      });
    }
  } catch (e) {
    const status = (e as any)?.response?.status;

    if (status === 401) {
      throw redirect("/");
    } else {
      throw json("Something went wrong", {
        status: status ?? 500,
      });
    }
  }

  const baseApiUrl = import.meta.env.VITE_API_URL ?? "";
  return json({ baseApiUrl });
}

export function HydrateFallback() {
  return (
    <div className="container mx-auto my-32">
      <AppMessage emptyMessage="Loading..." showBackButton={false} />
    </div>
  );
}

export function meta() {
  return [{ title: "New Diary Entry | Wanderlust" }];
}

export function links() {
  return [
    { rel: "stylesheet", href: uppyCoreStyles },
    { rel: "stylesheet", href: uppyDashboardStyles },
    { rel: "stylesheet", href: uppyFileInputStyles },
    { rel: "stylesheet", href: uppyImageEditorStyles },
  ];
}

clientLoader.hydrate = true;

export default function Page() {
  const { baseApiUrl } = useLoaderData<typeof clientLoader>();
  const form = useNewDiaryEntryForm();
  const state = useFormState(form);
  const [currentStep, setCurrentStep] = useState(1);
  const { saveToLocalStorage } = useSaveToLocalStorage(form);
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
        <div className="container mx-auto my-8">
          <BackLink href="/diary" text="Go back to your diary" />

          <EntryTitle className="mt-8" />

          <Stepper
            className="my-16 mx-auto"
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            steps={steps}
          />

          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 uppy={uppy} />}
          {currentStep === 5 && <Step5 uppy={uppy} baseApiUrl={baseApiUrl} />}

          <Nav
            onNavigationChange={saveToLocalStorage}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
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
