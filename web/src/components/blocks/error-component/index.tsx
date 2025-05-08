import { isApiError } from '@/lib/api';
import type { ErrorComponentProps } from '@tanstack/react-router';
import AppMessage from '../app-message';

export function ErrorComponent({ error }: ErrorComponentProps) {
  let msg = (() => {
    if (isApiError(error)) {
      if (error.detail) {
        return error.detail;
      }

      if (error.title) {
        return error.title;
      }
    }

    return 'Something went wrong';
  })();

  return (
    <div className="flex flex-col items-center justify-center">
      <AppMessage
        errorMessage={msg}
        showBackButton={true}
        backLink="/"
        backLinkText="Go back to the home page"
        className="my-32"
      />
    </div>
  );
}
