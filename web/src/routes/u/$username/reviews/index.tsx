import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/u/$username/reviews/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/u/$username/reviews/"!</div>
}
