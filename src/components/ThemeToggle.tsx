import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`group relative inline-flex h-8 w-8 items-center justify-center overflow-hidden border border-border text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_16px_-4px_hsl(var(--primary)/0.6)] ${className}`}
    >
      <Sun
        className={`theme-icon-swap absolute h-3.5 w-3.5 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        }`}
      />
      <Moon
        className={`theme-icon-swap absolute h-3.5 w-3.5 ${
          isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  );
}
