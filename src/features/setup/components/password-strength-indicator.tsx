import { useTranslation } from 'react-i18next'

type Rule = { labelKey: string; defaultLabel: string; test: (pw: string) => boolean }

const RULES: Rule[] = [
  { labelKey: 'setup.rules.length', defaultLabel: '8+ characters', test: (pw) => pw.length >= 8 },
  { labelKey: 'setup.rules.uppercase', defaultLabel: 'Uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { labelKey: 'setup.rules.lowercase', defaultLabel: 'Lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { labelKey: 'setup.rules.number', defaultLabel: 'Number', test: (pw) => /[0-9]/.test(pw) },
  { labelKey: 'setup.rules.special', defaultLabel: 'Special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

type Props = {
  password: string
}

export function PasswordStrengthIndicator({ password }: Props) {
  const { t } = useTranslation()
  if (!password) return null

  const passed = RULES.filter((r) => r.test(password)).length
  const strength = passed <= 2 ? 'weak' : passed <= 4 ? 'fair' : 'strong'

  const barColor =
    strength === 'weak'
      ? 'bg-destructive'
      : strength === 'fair'
        ? 'bg-yellow-500'
        : 'bg-green-600'

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {RULES.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              i < passed ? barColor : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {RULES.map((rule) => {
          const ok = rule.test(password)
          return (
            <span
              key={rule.labelKey}
              className={`text-xs transition-colors duration-150 ${
                ok ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              {ok ? '✓' : '○'} {t(rule.labelKey, rule.defaultLabel)}
            </span>
          )
        })}
      </div>
    </div>
  )
}
