import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Shield, Package, FileText, Eye, EyeOff, Check, UserCheck, UserX, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  type UserFormValues,
  userFormSchema,
  userRoleOptions,
  userStatusOptions,
} from '@/features/users/types/user-form'
import type { UserRole, UserStatus } from '@/features/users/types/user'
import { cn } from '@/lib/utils'

type UserFormProps = {
  defaultValues: UserFormValues
  submitLabel: string
  pendingLabel: string
  isPending: boolean
  errorMessage?: string
  onSubmit: (values: UserFormValues) => Promise<void>
}

const roleMeta: Record<UserRole, {
  titleKey: string
  defaultTitle: string
  descKey: string
  defaultDesc: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  SUPER_ADMIN: {
    titleKey: 'userForm.roles.super_admin',
    defaultTitle: 'Super Administrador',
    descKey: 'userForm.rolesDescriptions.super_admin',
    defaultDesc: 'Acesso global multi-tenant a todas as organizações e infraestrutura.',
    icon: Shield,
  },
  ORG_ADMIN: {
    titleKey: 'userForm.roles.org_admin',
    defaultTitle: 'Administrador da Organização',
    descKey: 'userForm.rolesDescriptions.org_admin',
    defaultDesc: 'Acesso total ao sistema, gestão de usuários, auditoria e configurações.',
    icon: Shield,
  },
  ASSET_MANAGER: {
    titleKey: 'userForm.roles.asset_manager',
    defaultTitle: 'Gestor de Ativos',
    descKey: 'userForm.rolesDescriptions.asset_manager',
    defaultDesc: 'Criar, editar, atribuir e gerenciar o inventário completo de ativos.',
    icon: Package,
  },
  AUDITOR: {
    titleKey: 'userForm.roles.auditor',
    defaultTitle: 'Auditor do Sistema',
    descKey: 'userForm.rolesDescriptions.auditor',
    defaultDesc: 'Acesso a relatórios de auditoria e visualização detalhada do sistema.',
    icon: FileText,
  },
  VIEWER: {
    titleKey: 'userForm.roles.viewer',
    defaultTitle: 'Visualizador (Apenas Leitura)',
    descKey: 'userForm.rolesDescriptions.viewer',
    defaultDesc: 'Acesso restrito apenas para visualização e consulta de ativos.',
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
    defaultTitle: 'Ativo',
    icon: UserCheck,
    activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700',
  },
  INACTIVE: {
    titleKey: 'userForm.status.inactive',
    defaultTitle: 'Inativo',
    icon: UserX,
    activeClass: 'border-slate-500 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  LOCKED: {
    titleKey: 'userForm.status.locked',
    defaultTitle: 'Bloqueado',
    icon: Lock,
    activeClass: 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700',
  },
}

export function UserForm({
  defaultValues,
  submitLabel,
  pendingLabel,
  isPending,
  errorMessage,
  onSubmit,
}: UserFormProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('userForm.labels.fullName', 'Full name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('userForm.placeholders.fullName', 'e.g. Jane Smith')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('userForm.labels.email', 'Email')}</FormLabel>
              <FormControl>
                <Input autoComplete="email" placeholder={t('userForm.placeholders.email', 'jane@company.com')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('userForm.labels.password', 'Password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('userForm.placeholders.password', 'Create a password')}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {t('userForm.passwordRequirements', 'A senha deve ter no mínimo 8 caracteres, contendo letra maiúscula, letra minúscula, número e caractere especial (ex: Senha123!).')}
                </p>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Roles Selection - Ultra Premium Card Grid */}
        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div>
                <FormLabel className="text-base font-semibold">
                  {t('userForm.labels.roles', 'Funções e Permissões')}
                </FormLabel>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('userForm.rolesHelp', 'Selecione uma ou mais funções para atribuir permissões a este usuário.')}
                </p>
              </div>
              <FormControl>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {userRoleOptions.map((role) => {
                    const meta = roleMeta[role]
                    const Icon = meta.icon
                    const isSelected = field.value?.includes(role)

                    const toggleRole = () => {
                      const current = field.value || []
                      let updated: UserRole[]

                      if (role === 'ORG_ADMIN') {
                        if (isSelected) {
                          // Unchecking ORG_ADMIN
                          updated = current.filter((r) => r !== 'ORG_ADMIN')
                        } else {
                          // Checking ORG_ADMIN: automatically select ALL organization roles!
                          updated = Array.from(new Set([...current, 'ORG_ADMIN', 'ASSET_MANAGER', 'AUDITOR', 'VIEWER'])) as UserRole[]
                        }
                      } else {
                        if (isSelected) {
                          // Unchecking a child role: also uncheck ORG_ADMIN if it was checked
                          updated = current.filter((r) => r !== role && r !== 'ORG_ADMIN')
                        } else {
                          updated = [...current, role]
                          // If all child roles are checked, auto-select ORG_ADMIN too!
                          const hasAllSubRoles = (['ASSET_MANAGER', 'AUDITOR', 'VIEWER'] as UserRole[]).every((r) => updated.includes(r))
                          if (hasAllSubRoles) {
                            updated = Array.from(new Set([...updated, 'ORG_ADMIN'])) as UserRole[]
                          }
                        }
                      }
                      field.onChange(updated)
                    }

                    return (
                      <div
                        key={role}
                        onClick={toggleRole}
                        className={cn(
                          'relative flex cursor-pointer items-start space-x-3 rounded-lg border p-3.5 transition-all hover:shadow-sm',
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
                          <div className="flex items-center gap-1.5 font-medium text-sm text-foreground">
                            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{t(meta.titleKey, meta.defaultTitle)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {t(meta.descKey, meta.defaultDesc)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Selection - Premium Segmented Buttons */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold">
                {t('userForm.labels.status', 'Status da Conta')}
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {userStatusOptions.map((status) => {
                    const meta = statusMeta[status]
                    const Icon = meta.icon
                    const isSelected = field.value === status

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => field.onChange(status)}
                        className={cn(
                          'flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-medium transition-all',
                          isSelected
                            ? meta.activeClass + ' shadow-xs font-semibold'
                            : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{t(meta.titleKey, meta.defaultTitle)}</span>
                      </button>
                    )
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive font-medium">
            {errorMessage}
          </div>
        ) : null}

        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
