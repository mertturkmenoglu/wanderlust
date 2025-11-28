import { createFileRoute, redirect } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/_admin/admin')({
	component: RouteComponent,
	beforeLoad: ({ context: { auth } }) => {
		const isDev = import.meta.env.DEV;

		if (!isDev || !auth.user || auth.user.role !== 'admin') {
			throw redirect({
				to: '/',
			});
		}
	},
});

const items = [
	{ name: 'Web', href: 'http://localhost:3000' },
	{ name: 'Web Admin Dashboard', href: 'http://localhost:3000/dashboard' },
	{ name: 'API Docs', href: 'http://localhost:5000/docs' },
	{ name: 'Typesense Dashboard', href: 'http://localhost:3006' },
	{ name: 'MinIO Dashboard', href: 'http://localhost:9001' },
	{ name: 'Mailpit', href: 'http://localhost:8025' },
	{ name: 'Asynqmon', href: 'http://localhost:8080' },
	{ name: 'Grafana', href: 'http://localhost:3010' },
	{ name: 'Inbucket', href: 'http://localhost:10000', disabled: true },
	{ name: 'Jaeger', href: 'http://localhost:16686', disabled: true },
	{ name: 'Open Observe', href: 'http://localhost:5080', disabled: true },
];

function RouteComponent() {
	return (
		<div className="mx-auto my-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<h2 className="col-span-full font-bold text-2xl">Admin Tools</h2>

			{items.map((item) => (
				<a
					key={item.name}
					href={item.disabled ? '#' : item.href}
					data-disabled={item.disabled ?? false}
					target="_blank"
					rel="noreferrer"
					className={cn(
						'flex items-center rounded-lg border border-border p-4 font-medium text-sm hover:bg-gray-50',
						'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-red-100 data-[disabled=true]:text-red-500',
					)}
				>
					{!item.disabled && (
						<span className="mr-2 size-1.5 rounded-full bg-green-500" />
					)}
					<span>{item.name}</span>
				</a>
			))}
		</div>
	);
}
