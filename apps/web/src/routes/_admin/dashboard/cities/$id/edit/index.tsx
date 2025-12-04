import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/dashboard/cities/$id/edit/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/dashboard/cities/$id/edit/"!</div>
}
