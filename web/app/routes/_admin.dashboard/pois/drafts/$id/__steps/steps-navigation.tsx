import { Link } from "react-router";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";

type Props = {
  draftId: string;
  step: number;
};

export default function StepsNavigation({ draftId, step }: Props) {
  const prevLink =
    step === 1 ? "#" : `/dashboard/pois/drafts/${draftId}?step=${step - 1}`;
  const nextLink =
    step === 5 ? `/dashboard/pois/drafts/${draftId}?step=6` : "#";

  return (
    <>
      <div className="flex justify-end">
        <Link
          to={prevLink}
          className={buttonVariants({
            variant: step === 1 ? "secondary" : "default",
            size: "icon",
          })}
        >
          <ChevronLeftIcon className="size-4" />
        </Link>
      </div>

      <div className="flex justify-start">
        {step !== 5 && (
          <Button variant="default" size="icon" type="submit">
            <ChevronRightIcon className="size-4" />
          </Button>
        )}
        {step === 5 && (
          <Link
            to={nextLink}
            className={buttonVariants({
              variant: "default",
              size: "icon",
            })}
          >
            <ChevronRightIcon className="size-4" />
          </Link>
        )}
      </div>
    </>
  );
}
