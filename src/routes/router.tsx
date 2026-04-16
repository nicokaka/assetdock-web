import { createBrowserRouter } from 'react-router-dom'

// Shell components are eagerly loaded — always needed and tiny.
import { AuthenticatedShell } from '@/components/layout/authenticated-shell'
import { AppShell } from '@/components/layout/app-shell'
import { RouteErrorBoundary } from '@/components/layout/route-error-boundary'
import { PageSuspense } from '@/components/layout/page-suspense'
import { RedirectIfAuthenticated, RequireSession } from '@/features/auth/components/session-guard'

// Lazy page components — each loaded on demand as a separate JS chunk.
import {
  LoginPage,
  HomePage,
  AppOverviewPage,
  AssetsPage,
  AssetCreatePage,
  AssetDetailPage,
  AssetEditPage,
  UsersPage,
  UserCreatePage,
  UserDetailPage,
  UserEditPage,
  AuditLogsPage,
  ImportsPage,
} from '@/routes/lazy-pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <PageSuspense>
            <HomePage />
          </PageSuspense>
        ),
      },
      {
        path: 'login',
        element: (
          <RedirectIfAuthenticated>
            <PageSuspense>
              <LoginPage />
            </PageSuspense>
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
            element: (
              <PageSuspense>
                <AppOverviewPage />
              </PageSuspense>
            ),
          },
          {
            path: 'assets',
            element: (
              <PageSuspense>
                <AssetsPage />
              </PageSuspense>
            ),
          },
          {
            path: 'assets/new',
            element: (
              <PageSuspense>
                <AssetCreatePage />
              </PageSuspense>
            ),
          },
          {
            path: 'assets/:assetId',
            element: (
              <PageSuspense>
                <AssetDetailPage />
              </PageSuspense>
            ),
          },
          {
            path: 'assets/:assetId/edit',
            element: (
              <PageSuspense>
                <AssetEditPage />
              </PageSuspense>
            ),
          },
          {
            path: 'users',
            element: (
              <PageSuspense>
                <UsersPage />
              </PageSuspense>
            ),
          },
          {
            path: 'users/new',
            element: (
              <PageSuspense>
                <UserCreatePage />
              </PageSuspense>
            ),
          },
          {
            path: 'users/:userId',
            element: (
              <PageSuspense>
                <UserDetailPage />
              </PageSuspense>
            ),
          },
          {
            path: 'users/:userId/edit',
            element: (
              <PageSuspense>
                <UserEditPage />
              </PageSuspense>
            ),
          },
          {
            path: 'audit-logs',
            element: (
              <PageSuspense>
                <AuditLogsPage />
              </PageSuspense>
            ),
          },
          {
            path: 'imports',
            element: (
              <PageSuspense>
                <ImportsPage />
              </PageSuspense>
            ),
          },
        ],
      },
    ],
  },
])
