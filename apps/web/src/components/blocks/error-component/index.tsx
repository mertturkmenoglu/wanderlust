import { type ErrorComponentProps, Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { isApiError } from '@/lib/api';

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
		switch (code) {
			case 400:
				return 'Bad request';
			case 401:
				return 'Unauthenticated';
			case 403:
				return 'Unauthorized';
			case 404:
				return 'Page not found';
			case 500:
				return 'Internal server error';
			default:
				return 'Something went wrong';
		}
	}, [code]);

	return (
		<>
			<div className="my-64 flex flex-col-reverse items-center justify-center gap-24 lg:mx-32 lg:flex-row lg:gap-48">
				<div className="text-sky-600">
					<div className="font-bold text-2xl text-sky-600">Error {code}</div>
					<div className="mt-4 font-bold text-6xl text-sky-600">{message}</div>
					<div className="mt-8 text-xl">
						Something squirrelly happened somewhere!
					</div>
					<div>You can try to refresh the page or go to the homepage.</div>
					<Link
						to="/"
						className="mt-8 flex rounded bg-sky-600 px-4 py-2 font-bold text-lg text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
					>
						Country roads take me home
					</Link>
				</div>
				<div>
					<img
						src="/logo.png"
						alt="Wanderlust"
						className="size-48 min-h-48 min-w-48"
					/>
				</div>
			</div>

			<Collapsible className="mx-auto text-center">
				<CollapsibleTrigger className="text-center text-sm hover:underline">
					If you are a wise (or curious) squirrel, click here to see the error.
				</CollapsibleTrigger>
				<CollapsibleContent>
					<code className="mt-4 block rounded border border-sky-600 p-4 text-left text-xs">
						<pre>{JSON.stringify(error, null, 2)}</pre>
					</code>
				</CollapsibleContent>
			</Collapsible>
		</>
	);
}
