import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanstackDevtools } from '@tanstack/react-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
      />
    </>
  ),
})
