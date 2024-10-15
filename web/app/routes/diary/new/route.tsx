import { useMemo, useState } from "react";

import BackLink from "~/components/blocks/back-link";
import { useNewDiaryEntryForm } from "./hooks";
import Nav from "./nav";
import Step1 from "./step1";
import Step2 from "./step2";
import Stepper from "./stepper";
import { steps } from "./steps";

export function meta() {
  return [{ title: "New Diary Entry | Wanderlust" }];
}

export default function Page() {
  const form = useNewDiaryEntryForm();
  const [currentStep, setCurrentStep] = useState(1);

  const title = form.watch("title");
  const displayTitle = useMemo(() => {
    if (title && title !== "") {
      return title;
    }

    return "New Diary Entry";
  }, [title]);

  return (
    <div className="container mx-auto my-8">
      <BackLink href="/diary" text="Go back to your diary" />

      <h2 className="text-4xl mt-8">{displayTitle}</h2>

      <Stepper
        className="my-16 mx-auto"
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        steps={steps}
      />

      {currentStep === 1 && <Step1 form={form} />}
      {currentStep === 2 && <Step2 form={form} />}

      <Nav currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </div>
  );
}
