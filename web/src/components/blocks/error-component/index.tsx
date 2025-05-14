import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { isApiError } from '@/lib/api';
import { Link, type ErrorComponentProps } from '@tanstack/react-router';
import { useMemo } from 'react';

export function ErrorComponent({ error }: ErrorComponentProps) {
  const code = useMemo(() => {
    if (isApiError(error)) {
      return error.status ?? 500;
    }

    if (error.name === 'Not Found') {
      return 404;
    }

    return 500;
  }, [error]);

  const message = useMemo(() => {
    if (code === 400) {
      return 'Bad request';
    } else if (code === 401) {
      return 'Unauthenticated';
    } else if (code === 403) {
      return 'Unauthorized';
    } else if (code === 404) {
      return 'Page not found';
    } else if (code === 500) {
      return 'Internal server error';
    } else {
      return 'Something went wrong';
    }
  }, [code]);

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center lg:mx-32 my-64 gap-24 lg:gap-48">
        <div className="text-sky-600">
          <div className="text-sky-600 text-2xl font-bold">Error {code}</div>
          <div className="text-sky-600 text-6xl font-bold mt-4">{message}</div>
          <div className="text-xl mt-8">
            Something squirrelly happened somewhere!
          </div>
          <div>You can try to refresh the page or go to the homepage.</div>
          <Link
            to="/"
            className="rounded bg-sky-600 text-white px-4 py-2 mt-8 hover:bg-sky-500 flex font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-none focus:ring-offset-2"
          >
            Country roads take me home
          </Link>
        </div>
        <div>
          <img
            src="/logo.png"
            alt="Wanderlust"
            className="size-48 min-w-48 min-h-48"
          />
        </div>
      </div>

      <Collapsible className="mx-auto text-center">
        <CollapsibleTrigger className="text-sm hover:underline text-center">
          If you are a wise (or curious) squirrel, click here to see the error.
        </CollapsibleTrigger>
        <CollapsibleContent>
          <code className="border border-sky-600 rounded p-4 mt-4 block text-xs text-left">
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </code>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
