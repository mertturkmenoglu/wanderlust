import { createFileRoute, redirect } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { authGuard } from '@/lib/auth';

export const Route = createFileRoute('/_admin/admin')({
	component: RouteComponent,
	beforeLoad: async ({ context: { orpc } }) => {
		const isDev = import.meta.env.DEV;
		const auth = await authGuard();
		const { role } = await orpc.users.getRole.call({});

		if (!isDev || !auth.auth.user || role !== 'admin') {
			throw redirect({
				to: '/',
			});
		}

		return auth;
	},
});

const items = [
	{ name: 'Web', href: 'http://localhost:3000' },
	{ name: 'Web Admin Dashboard', href: 'http://localhost:3000/dashboard' },
	{ name: 'API Docs', href: 'http://localhost:5000/api' },
	{ name: 'Typesense Dashboard', href: 'http://localhost:3006' },
	{ name: 'Mailpit', href: 'http://localhost:8025' },
];

function RouteComponent() {
	return (
		<div className="mx-auto my-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
			<h2 className="col-span-full font-bold text-2xl">Admin Tools</h2>

			{items.map((item) => (
				<a
					key={item.name}
					href={item.href}
					target="_blank"
					rel="noreferrer"
					className={cn(
						'flex items-center rounded-lg border border-border',
						'p-4 font-medium text-sm hover:bg-gray-50',
					)}
				>
					<span className="mr-2 size-1.5 rounded-full bg-green-500" />
					<span>{item.name}</span>
				</a>
			))}
		</div>
	);
}
