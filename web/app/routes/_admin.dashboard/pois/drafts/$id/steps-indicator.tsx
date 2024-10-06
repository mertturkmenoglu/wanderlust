import { Link, useSearchParams } from "@remix-run/react";
import { useMemo } from "react";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/lib/utils";

const steps = [
  { label: "Basic Info", value: 1 },
  { label: "Address", value: 2 },
  { label: "Amenities", value: 3 },
  { label: "Open Hours", value: 4 },
  { label: "Media", value: 5 },
  { label: "Review", value: 6 },
];

type Props = {
  draftId: string;
};

export default function StepsIndicator({ draftId }: Props) {
  const [params] = useSearchParams();
  const step = params.get("step") ?? "1";
  const progress = useMemo(() => {
    const int = parseInt(step, 10);
    if (isNaN(int)) {
      return 0;
    }
    const w = 100 / steps.length;
    return int * w * 0.95;
  }, [step]);

  return (
    <div className="">
      <Progress value={progress} />
      <div className="flex items-center justify-around mt-4">
        {steps.map((s) => (
          <Link
            key={s.value}
            to={`/dashboard/pois/drafts/${draftId}?step=${s.value}`}
            className={cn("text-sm", {
              "text-primary": s.value === parseInt(step, 10),
              "text-muted-foreground": s.value !== parseInt(step, 10),
            })}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
