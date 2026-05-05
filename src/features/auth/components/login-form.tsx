import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { HttpError } from '@/lib/http-client'
import { useLoginMutation } from '@/features/auth/hooks/use-session'
import { type LoginInput, loginSchema } from '@/features/auth/schemas/login-schema'
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

export function LoginForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLoginMutation()
  const { t } = useTranslation()
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginInput) {
    form.clearErrors('root')

    try {
      await loginMutation.mutateAsync(values)
      navigate('/app', { replace: true })
    } catch (error) {
      let message = t('auth.login.errorGeneric', 'Unable to sign in right now.')
      
      if (error instanceof HttpError) {
        if (error.status === 401) {
          message = t('auth.login.errorInvalid', 'Invalid email or password.')
        } else if (error.status === 423) {
          message = t('auth.login.errorLocked', 'Your account has been locked. Contact your administrator.')
        }
      }

      form.setError('root', { message })
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.login.emailLabel', 'Email')}</FormLabel>
                <FormControl>
                  <Input autoComplete="email" placeholder={t('auth.login.emailPlaceholder', 'name@company.com')} {...field} />
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
                <FormLabel>{t('auth.login.passwordLabel', 'Password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder={t('auth.login.passwordPlaceholder', 'Enter your password')}
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
                        {showPassword ? t('auth.login.hidePassword', 'Hide password') : t('auth.login.showPassword', 'Show password')}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root?.message ? (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
          ) : null}
          <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending 
              ? t('auth.login.submitButtonLoading', 'Signing in...') 
              : t('auth.login.submitButton', 'Sign in')}
          </Button>
          <div className="pt-2 text-center">
            <p className="text-xs text-muted-foreground">
              {t('auth.login.forgotPassword', 'Forgot your password? Contact your organization administrator.')}
            </p>
          </div>
        </form>
      </Form>
    </div>
  )
}
