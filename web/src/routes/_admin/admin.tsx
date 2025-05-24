import { cn } from '@/lib/utils';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/admin')({
  component: RouteComponent,
  beforeLoad: ({ context: { auth } }) => {
    const isDev = import.meta.env.DEV;
    console.log({ isDev });

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
  { name: 'Inbucket', href: 'http://localhost:10000' },
  { name: 'Asynqmon', href: 'http://localhost:8080' },
  { name: 'Grafana', href: 'http://localhost:3010' },
  { name: 'Jaeger', href: 'http://localhost:16686', disabled: true },
  { name: 'Open Observe', href: 'http://localhost:5080', disabled: true },
];

function RouteComponent() {
  return (
    <div className="max-w-7xl my-16 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <h2 className="text-2xl font-bold col-span-full">Admin Tools</h2>

      {items.map((item) => (
        <a
          key={item.name}
          href={item.disabled ? '#' : item.href}
          data-disabled={item.disabled ? item.disabled : false}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'flex items-center rounded-lg border border-border p-4 text-sm font-medium hover:bg-gray-50',
            'data-[disabled=true]:bg-red-100 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-red-500',
          )}
        >
          {!item.disabled && (
            <span className="rounded-full size-1.5 bg-green-500 mr-2"></span>
          )}
          <span>{item.name}</span>
        </a>
      ))}
    </div>
  );
}
