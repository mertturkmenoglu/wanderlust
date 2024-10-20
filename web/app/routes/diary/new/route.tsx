import { useEffect, useMemo, useState } from "react";

import { json, redirect, useLoaderData } from "@remix-run/react";
import BackLink from "~/components/blocks/back-link";
import { Button } from "~/components/ui/button";
import { getMe } from "~/lib/api";
import { useNewDiaryEntryForm } from "./hooks";
import Nav from "./nav";
import { schema } from "./schema";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Stepper from "./stepper";
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
  const displayTitle = useMemo(() => {
    if (title && title !== "") {
      return title;
    }

    return "New Diary Entry";
  }, [title]);

  const saveToLocalStorage = () => {
    if (form !== null) {
      localStorage.setItem("diary-entry", JSON.stringify(form.getValues()));
    }
  };

  useEffect(() => {
    const v = localStorage.getItem("diary-entry");

    if (!v) {
      return;
    }

    try {
      const asObject = JSON.parse(v);
      const parsed = schema.parse(asObject);
      form.reset(parsed);
    } catch (e) {
      console.log("try catch", e);
    }
  }, []);

  return (
    <div className="container mx-auto my-8">
      <BackLink href="/diary" text="Go back to your diary" />

      <div className="flex items-center gap-4 mt-8">
        <h2 className="text-4xl">{displayTitle}</h2>
        <Button onClick={saveToLocalStorage} variant="link">
          Save
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
