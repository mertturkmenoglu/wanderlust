import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/u/$username/favorites/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/u/$username/favorites/"!</div>
}
