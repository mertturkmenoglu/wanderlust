import { Link } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Props = {
  className?: string;
  href: string;
  text?: string;
};

export default function BackLink({
  href,
  className,
  text = "Go back",
}: Readonly<Props>) {
  return (
    <Link to={href} className={cn(className)}>
      <Button variant="link" className="px-0" asChild>
        <div className="flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <div>{text}</div>
        </div>
      </Button>
    </Link>
  );
}
