import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'
import { LoginPage } from '@/features/auth/components/login-page'
import { RedirectIfAuthenticated, RequireSession } from '@/features/auth/components/session-guard'
import { AppPage } from '@/pages/app-page'
import { HomePage } from '@/pages/home-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: (
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        ),
      },
      {
        path: 'app',
        element: (
          <RequireSession>
            <AppPage />
          </RequireSession>
        ),
      },
    ],
  },
])
