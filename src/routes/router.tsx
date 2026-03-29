import { createBrowserRouter } from 'react-router-dom'

import { AuthenticatedShell } from '@/components/layout/authenticated-shell'
import { AppShell } from '@/components/layout/app-shell'
import { AssetCreatePage } from '@/pages/asset-create-page'
import { AssetEditPage } from '@/pages/asset-edit-page'
import { LoginPage } from '@/features/auth/components/login-page'
import { RedirectIfAuthenticated, RequireSession } from '@/features/auth/components/session-guard'
import { AssetDetailPage } from '@/pages/asset-detail-page'
import { AuditLogsPage } from '@/pages/audit-logs-page'
import { AppOverviewPage } from '@/pages/app-overview-page'
import { AssetsPage } from '@/pages/assets-page'
import { HomePage } from '@/pages/home-page'
import { ImportsPage } from '@/pages/imports-page'
import { UserCreatePage } from '@/pages/user-create-page'
import { UserDetailPage } from '@/pages/user-detail-page'
import { UsersPage } from '@/pages/users-page'

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
            <AuthenticatedShell />
          </RequireSession>
        ),
        children: [
          {
            index: true,
            element: <AppOverviewPage />,
          },
          {
            path: 'assets',
            element: <AssetsPage />,
          },
          {
            path: 'assets/new',
            element: <AssetCreatePage />,
          },
          {
            path: 'assets/:assetId',
            element: <AssetDetailPage />,
          },
          {
            path: 'assets/:assetId/edit',
            element: <AssetEditPage />,
          },
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'users/new',
            element: <UserCreatePage />,
          },
          {
            path: 'users/:userId',
            element: <UserDetailPage />,
          },
          {
            path: 'audit-logs',
            element: <AuditLogsPage />,
          },
          {
            path: 'imports',
            element: <ImportsPage />,
          },
        ],
      },
    ],
  },
])
