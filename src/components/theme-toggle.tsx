import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  // Determine actual rendered theme, fallback to dark
  const resolvedTheme = theme === 'system' ? 'dark' : theme

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      title="Toggle Theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-muted-foreground transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-muted-foreground transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
