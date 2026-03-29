import type { LoginInput } from '@/features/auth/schemas/login-schema'

export type LoginResult = {
  accessToken: string
  user: {
    email: string
  }
}

export async function login(credentials: LoginInput): Promise<LoginResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 300))

  return {
    accessToken: 'stub-access-token',
    user: {
      email: credentials.email,
    },
  }
}
