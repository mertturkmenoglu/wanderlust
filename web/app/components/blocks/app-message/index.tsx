import { Link } from "@remix-run/react";
import clsx from "clsx";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Props = {
  className?: string;
  showBackButton?: boolean;
  errorMessage?: React.ReactNode;
  successMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  imageClassName?: string;
};

export default function AppMessage({
  className,
  errorMessage,
  successMessage,
  emptyMessage,
  showBackButton = true,
  imageClassName,
}: Readonly<Props>) {
  return (
    <div
      className={clsx(
        "flex h-full flex-col items-center justify-center space-y-4",
        className
      )}
    >
      <img
        src="/logo.png"
        alt="Wanderlust"
        className={cn(
          "size-24",
          {
            grayscale: !successMessage,
          },
          imageClassName
        )}
      />
      {errorMessage && (
        <div className="text-lg font-semibold text-destructive">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="text-lg font-semibold text-primary">
          {successMessage}
        </div>
      )}
      {emptyMessage && (
        <div className="text-lg font-semibold text-muted-foreground">
          {emptyMessage}
        </div>
      )}
      {showBackButton && (
        <Button
          asChild
          variant="link"
          className={cn({
            "text-destructive": errorMessage,
          })}
        >
          <Link to="/">Go back to the homepage</Link>
        </Button>
      )}
    </div>
  );
}
