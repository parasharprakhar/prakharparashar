import { useState, useEffect } from "react";

export type ThemeMode = "dark" | "light" | "midnight" | "ocean";

const THEME_KEY = "pp_portfolio_theme";

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem(THEME_KEY) as ThemeMode) || "dark";
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (t: ThemeMode) => setThemeState(t);

  return { theme, setTheme };
};
