import { useState } from 'react'
import { Shield, Package, FileText, Eye, Check, UserCheck, UserX, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUpdateUserRoles, useUpdateUserStatus } from '@/features/users/hooks/use-user-lifecycle-actions'
import type { UserDetail, UserRole, UserStatus } from '@/features/users/types/user'
import { userRoleOptions, userStatusOptions } from '@/features/users/types/user-form'
import { HttpError } from '@/lib/http-client'
import { cn } from '@/lib/utils'

type UserLifecycleActionsProps = {
  user: UserDetail
}

const ORG_CHILD_ROLES: readonly UserRole[] = ['ASSET_MANAGER', 'AUDITOR', 'VIEWER']

const roleMeta: Record<UserRole, {
  titleKey: string
  defaultTitle: string
  descKey: string
  defaultDesc: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  SUPER_ADMIN: {
    titleKey: 'userForm.roles.super_admin',
    defaultTitle: 'Super Admin',
    descKey: 'userForm.rolesDescriptions.super_admin',
    defaultDesc: 'Global multi-tenant access across all organizations and infrastructure.',
    icon: Shield,
  },
  ORG_ADMIN: {
    titleKey: 'userForm.roles.org_admin',
    defaultTitle: 'Organization Admin',
    descKey: 'userForm.rolesDescriptions.org_admin',
    defaultDesc: 'Full system access, user management, audit logs, and organization settings.',
    icon: Shield,
  },
  ASSET_MANAGER: {
    titleKey: 'userForm.roles.asset_manager',
    defaultTitle: 'Asset Manager',
    descKey: 'userForm.rolesDescriptions.asset_manager',
    defaultDesc: 'Create, edit, assign, and manage complete asset inventory.',
    icon: Package,
  },
  AUDITOR: {
    titleKey: 'userForm.roles.auditor',
    defaultTitle: 'System Auditor',
    descKey: 'userForm.rolesDescriptions.auditor',
    defaultDesc: 'Access to audit reports and detailed system inspection views.',
    icon: FileText,
  },
  VIEWER: {
    titleKey: 'userForm.roles.viewer',
    defaultTitle: 'Viewer (Read Only)',
    descKey: 'userForm.rolesDescriptions.viewer',
    defaultDesc: 'Restricted read-only access to browse assets and information.',
    icon: Eye,
  },
}

const statusMeta: Record<UserStatus, {
  titleKey: string
  defaultTitle: string
  icon: React.ComponentType<{ className?: string }>
  activeClass: string
}> = {
  ACTIVE: {
    titleKey: 'userForm.status.active',
    defaultTitle: 'Active',
    icon: UserCheck,
    activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700',
  },
  INACTIVE: {
    titleKey: 'userForm.status.inactive',
    defaultTitle: 'Inactive',
    icon: UserX,
    activeClass: 'border-slate-500 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  LOCKED: {
    titleKey: 'userForm.status.locked',
    defaultTitle: 'Locked',
    icon: Lock,
    activeClass: 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700',
  },
}

function getMutationErrorMessage(error: unknown, fallbackMessage: string): string | undefined {
  if (!error) return undefined
  if (error instanceof HttpError && error.message) {
    return error.message
  }
  return fallbackMessage
}

export function UserLifecycleActions({ user }: UserLifecycleActionsProps) {
  const { t } = useTranslation()
  const [statusValue, setStatusValue] = useState<UserStatus>(user.status)
  const [roleValues, setRoleValues] = useState<UserRole[]>(user.roles)

  const updateStatusMutation = useUpdateUserStatus(user.id)
  const updateRolesMutation = useUpdateUserRoles(user.id)

  const statusErrorMessage = updateStatusMutation.isError
    ? getMutationErrorMessage(
        updateStatusMutation.error,
        t('userForm.errorGeneric', 'Unable to update status right now.'),
      )
    : undefined

  const rolesErrorMessage = updateRolesMutation.isError
    ? getMutationErrorMessage(
        updateRolesMutation.error,
        t('userForm.errorGeneric', 'Unable to update roles right now.'),
      )
    : undefined

  function toggleRole(role: UserRole) {
    setRoleValues((current) => {
      const isSelected = current.includes(role)
      if (role === 'ORG_ADMIN') {
        if (isSelected) {
          return current.filter((r) => r !== 'ORG_ADMIN')
        }
        return Array.from(new Set([...current, 'ORG_ADMIN', ...ORG_CHILD_ROLES])) as UserRole[]
      }

      if (isSelected) {
        return current.filter((r) => r !== role && r !== 'ORG_ADMIN')
      }

      const updated = [...current, role]
      const hasAllChildRoles = ORG_CHILD_ROLES.every((child) => updated.includes(child))
      return hasAllChildRoles
        ? (Array.from(new Set([...updated, 'ORG_ADMIN'])) as UserRole[])
        : updated
    })
  }

  const rolesUnchanged =
    JSON.stringify([...roleValues].sort()) === JSON.stringify([...user.roles].sort())

  return (
    <>
      <Card className="border-border shadow-none">
        <CardHeader className="gap-1">
          <CardTitle className="text-base font-medium">{t('userForm.labels.status', 'Status')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {userStatusOptions.map((status) => {
              const meta = statusMeta[status]
              const Icon = meta.icon
              const isSelected = statusValue === status

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusValue(status)}
                  disabled={updateStatusMutation.isPending}
                  className={cn(
                    'flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-medium transition-all',
                    isSelected
                      ? `${meta.activeClass} font-semibold shadow-xs`
                      : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{t(meta.titleKey, meta.defaultTitle)}</span>
                </button>
              )
            })}
          </div>
          {statusErrorMessage ? (
            <p className="text-sm text-destructive">{statusErrorMessage}</p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={updateStatusMutation.isPending || statusValue === user.status}
            onClick={() => {
              void updateStatusMutation.mutateAsync(statusValue).catch(() => {})
            }}
          >
            {updateStatusMutation.isPending ? t('userForm.submittingEdit', 'Saving...') : t('userForm.submitEdit', 'Save status')}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardHeader className="gap-1">
          <CardTitle className="text-base font-medium">{t('userForm.labels.roles', 'Roles')}</CardTitle>
          <CardDescription>
            {t(
              'userForm.rolesHelp',
              'Organization Admin automatically includes Asset Manager, Auditor, and Viewer permissions.',
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {userRoleOptions.map((role) => {
              const meta = roleMeta[role]
              const Icon = meta.icon
              const isSelected = roleValues.includes(role)

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  disabled={updateRolesMutation.isPending}
                  className={cn(
                    'relative flex cursor-pointer items-start space-x-3 rounded-lg border p-3.5 text-left transition-all hover:shadow-sm',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                      : 'border-border bg-card hover:border-primary/50'
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30 bg-background'
                    )}
                  >
                    {isSelected ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : null}
                  </div>
                  <div className="space-y-1 pr-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{t(meta.titleKey, meta.defaultTitle)}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {t(meta.descKey, meta.defaultDesc)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
          {rolesErrorMessage ? (
            <p className="text-sm text-destructive">{rolesErrorMessage}</p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={updateRolesMutation.isPending || roleValues.length === 0 || rolesUnchanged}
            onClick={() => {
              void updateRolesMutation.mutateAsync(roleValues).catch(() => {})
            }}
          >
            {updateRolesMutation.isPending ? t('userForm.submittingEdit', 'Saving...') : t('userForm.submitEdit', 'Save roles')}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
