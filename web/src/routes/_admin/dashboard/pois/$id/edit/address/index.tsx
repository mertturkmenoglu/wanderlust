import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_admin/dashboard/pois/$id/edit/address/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/dashboard/pois/$id/edit/address/"!</div>
}
