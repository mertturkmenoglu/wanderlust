import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/diary/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/diary/new/"!</div>
}
