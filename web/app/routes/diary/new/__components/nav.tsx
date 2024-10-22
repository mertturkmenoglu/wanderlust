import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

type Props = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onNavigationChange: () => void;
};

export default function Nav({
  currentStep,
  setCurrentStep,
  onNavigationChange,
}: Props) {
  return (
    <div className="max-w-xl mx-auto flex items-center gap-4 justify-between mt-16 mb-48">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        disabled={currentStep === 1}
        onClick={() => {
          setCurrentStep(currentStep - 1);
          onNavigationChange();
        }}
      >
        <ArrowLeftIcon className="size-4" />
        <span>Previous</span>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        disabled={currentStep === 6}
        onClick={() => {
          setCurrentStep(currentStep + 1);
          onNavigationChange();
        }}
      >
        <span>Next</span>
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  );
}
