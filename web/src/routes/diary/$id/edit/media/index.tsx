import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/diary/$id/edit/media/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/diary/$id/edit/media/"!</div>
}
