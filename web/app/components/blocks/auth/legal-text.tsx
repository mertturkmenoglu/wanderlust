import { Link } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Props = {
  type: "signin" | "signup";
};

export default function AuthLegalText({ type }: Props) {
  return (
    <div className="text-xs text-muted-foreground">
      {type === "signin"
        ? "By signing in, you agree to our"
        : "By signing up, you agree to our"}{" "}
      <Link
        to="/terms"
        className={cn(buttonVariants({ variant: "link", size: "sm" }), "px-0")}
      >
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link
        to="/privacy"
        className={cn(buttonVariants({ variant: "link", size: "sm" }), "px-0")}
      >
        Privacy Policy
      </Link>
      {"."}
      <div>
        You also agree that you are not Baran Kandil or an affiliate of him.
      </div>
    </div>
  );
}
