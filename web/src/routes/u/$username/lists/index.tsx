import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/u/$username/lists/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/u/$username/lists/"!</div>
}
