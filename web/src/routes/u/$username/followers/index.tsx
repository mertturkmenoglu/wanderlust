import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/u/$username/followers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/u/$username/followers/"!</div>
}
