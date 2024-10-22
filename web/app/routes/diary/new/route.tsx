import { json, redirect, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import BackLink from "~/components/blocks/back-link";
import { Button } from "~/components/ui/button";
import { getMe } from "~/lib/api";
import Nav from "./__components/nav";
import Step1 from "./__components/step1";
import Step2 from "./__components/step2";
import Step3 from "./__components/step3";
import Step4 from "./__components/step4";
import Step5 from "./__components/step5";
import Stepper from "./__components/stepper";
import { useNewDiaryEntryForm, useSaveToLocalStorage } from "./hooks";
import { steps } from "./steps";

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
  return <h1>Loading...</h1>;
}

export function meta() {
  return [{ title: "New Diary Entry | Wanderlust" }];
}

clientLoader.hydrate = true;

export default function Page() {
  const { baseApiUrl } = useLoaderData<typeof clientLoader>();
  const form = useNewDiaryEntryForm();
  const [currentStep, setCurrentStep] = useState(1);
  const title = form.watch("title");
  const displayTitle = title && title !== "" ? title : "New Diary Entry";
  const { saveStatus, saveText, saveToLocalStorage } =
    useSaveToLocalStorage(form);

  return (
    <div className="container mx-auto my-8">
      <BackLink href="/diary" text="Go back to your diary" />

      <div className="flex items-center gap-4 mt-8">
        <h2 className="text-4xl">{displayTitle}</h2>
        <Button
          onClick={saveToLocalStorage}
          variant="link"
          disabled={saveStatus !== "idle"}
        >
          {saveText}
        </Button>
      </div>

      <Stepper
        className="my-16 mx-auto"
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        steps={steps}
      />

      {currentStep === 1 && <Step1 form={form} />}
      {currentStep === 2 && <Step2 form={form} />}
      {currentStep === 3 && <Step3 form={form} />}
      {currentStep === 4 && <Step4 form={form} baseApiUrl={baseApiUrl} />}
      {currentStep === 5 && <Step5 form={form} />}

      <Nav
        onNavigationChange={saveToLocalStorage}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    </div>
  );
}
