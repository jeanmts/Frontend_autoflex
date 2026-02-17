import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider";



export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      tabIndex={0}
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cursor-pointer bg-background absolute right-41 "
    >
      <Sun
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />

      <Moon
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />

      <span tabIndex={0} className="sr-only">
        Trocar tema
      </span>
    </Button>
  )
}