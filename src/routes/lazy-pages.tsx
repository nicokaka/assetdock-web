/**
 * Lazy-loaded page components for code splitting.
 * Each import becomes its own JS chunk, loaded on demand.
 */
import { lazy } from 'react'

export const LoginPage = lazy(() =>
  import('@/features/auth/components/login-page').then((m) => ({ default: m.LoginPage })),
)

export const HomePage = lazy(() =>
  import('@/pages/home-page').then((m) => ({ default: m.HomePage })),
)

export const AppOverviewPage = lazy(() =>
  import('@/pages/app-overview-page').then((m) => ({ default: m.AppOverviewPage })),
)

export const AssetsPage = lazy(() =>
  import('@/pages/assets-page').then((m) => ({ default: m.AssetsPage })),
)

export const AssetCreatePage = lazy(() =>
  import('@/pages/asset-create-page').then((m) => ({ default: m.AssetCreatePage })),
)

export const AssetDetailPage = lazy(() =>
  import('@/pages/asset-detail-page').then((m) => ({ default: m.AssetDetailPage })),
)

export const AssetEditPage = lazy(() =>
  import('@/pages/asset-edit-page').then((m) => ({ default: m.AssetEditPage })),
)

export const UsersPage = lazy(() =>
  import('@/pages/users-page').then((m) => ({ default: m.UsersPage })),
)

export const UserCreatePage = lazy(() =>
  import('@/pages/user-create-page').then((m) => ({ default: m.UserCreatePage })),
)

export const UserDetailPage = lazy(() =>
  import('@/pages/user-detail-page').then((m) => ({ default: m.UserDetailPage })),
)

export const UserEditPage = lazy(() =>
  import('@/pages/user-edit-page').then((m) => ({ default: m.UserEditPage })),
)

export const AuditLogsPage = lazy(() =>
  import('@/pages/audit-logs-page').then((m) => ({ default: m.AuditLogsPage })),
)

export const ImportsPage = lazy(() =>
  import('@/pages/imports-page').then((m) => ({ default: m.ImportsPage })),
)
