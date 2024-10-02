import { Link } from "@remix-run/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";

type Props = {
  draftId: string;
  step: number;
};

export default function StepsNavigation({ draftId, step }: Props) {
  const prevLink =
    step === 1 ? "#" : `/dashboard/pois/drafts/${draftId}?step=${step - 1}`;

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
        <Button variant="default" size="icon" type="submit">
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </>
  );
}
