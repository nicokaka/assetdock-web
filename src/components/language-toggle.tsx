import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { i18n } = useTranslation()

  // Prevents bugs if browser returns 'en-US' instead of just 'en'
  const isEnglish = i18n.language.toLowerCase().startsWith('en')

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => i18n.changeLanguage(isEnglish ? "pt-BR" : "en")}
      title={`Switch to ${isEnglish ? 'Portuguese' : 'English'}`}
    >
      <Languages className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
      <span className="sr-only">Toggle language</span>
    </Button>
  )
}
