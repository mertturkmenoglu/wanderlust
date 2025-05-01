import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export default function SignInButton() {
  return (
    <Link to="/sign-in">
      <Button variant="default" className="" asChild>
        <div className="flex items-center gap-2">
          <div>Sign in</div>
          <ArrowRight className="size-4" />
        </div>
      </Button>
    </Link>
  );
}
