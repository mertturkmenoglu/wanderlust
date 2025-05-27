import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/dashboard/pois/$id/edit/hours/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/dashboard/pois/$id/edit/hours/"!</div>
}
