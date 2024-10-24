import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

type Props = {
  className?: string;
  steps: Array<{
    step: number;
    content: React.ReactNode;
  }>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function Stepper({
  steps,
  className,
  currentStep,
  setCurrentStep,
}: Props) {
  return (
    <ScrollArea>
      <div
        className={cn("flex flex-row items-center justify-between", className)}
      >
        {steps.map((s) => (
          <div
            key={s.step}
            className={cn("flex items-center", {
              "flex-1": s.step !== steps.length,
            })}
          >
            <StepperItem
              key={s.step}
              step={s.step}
              content={s.content}
              currentStep={currentStep}
              onClick={() => setCurrentStep(s.step)}
            />
            {s.step !== steps.length && (
              <div className="h-[1px] bg-border block w-full -mt-12"></div>
            )}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

type StepperItemProps = {
  className?: string;
  step: number;
  currentStep: number;
  content: React.ReactNode;
  onClick?: () => void;
};

export function StepperItem({
  className,
  step,
  currentStep,
  content,
  onClick,
}: StepperItemProps) {
  const isCurrentStep = currentStep === step;
  const isCompleted = currentStep > step;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 px-4 justify-center",
        className
      )}
    >
      <div
        className={cn(
          "border border-border p-2 rounded-full size-10 flex items-center justify-center",
          {
            "text-primary border-primary": isCurrentStep,
            "bg-muted/50": isCompleted,
          }
        )}
      >
        {step}
      </div>
      <div
        className={cn("text-sm line-clamp-2 h-10 text-center max-w-32", {
          "text-primary": isCurrentStep,
        })}
      >
        {content}
      </div>
    </button>
  );
}
