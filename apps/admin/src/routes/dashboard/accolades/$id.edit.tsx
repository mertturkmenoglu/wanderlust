import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/accolades/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/accolades/$id/edit"!</div>
}
