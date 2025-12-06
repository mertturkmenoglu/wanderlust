import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_admin/dashboard/collections/relations/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/dashboard/collections/relations/"!</div>
}
