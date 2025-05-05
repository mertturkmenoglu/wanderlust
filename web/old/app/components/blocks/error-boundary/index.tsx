// Taken from Epic Stack
// https://github.com/epicweb-dev/epic-stack/blob/main/app/components/error-boundary.tsx

import { type ErrorResponse, isRouteErrorResponse, useParams, useRouteError } from "react-router";
import AppMessage from "../app-message";

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => JSX.Element | null;

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  console.error("Unable to get error message for error", error);
  return "Unknown Error";
}

export function GeneralErrorBoundary({
  defaultStatusHandler = ({ error }) => (
    <div className="my-32">
      <AppMessage
        errorMessage={`${error.status} ${error.data}`}
        showBackButton={true}
      />
    </div>
  ),
  statusHandlers,
  unexpectedErrorHandler = (error) => (
    <div>
      <AppMessage emptyMessage={getErrorMessage(error)} showBackButton={true} />
    </div>
  ),
}: {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null;
}) {
  const error = useRouteError();
  const params = useParams();

  if (typeof document !== "undefined") {
    console.error(error);
  }

  return (
    <div className="max-w-7xl flex items-center justify-center p-20 text-xl mx-auto">
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error,
            params,
          })
        : unexpectedErrorHandler(error)}
    </div>
  );
}
