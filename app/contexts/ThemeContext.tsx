import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setColorScheme("light");
    setIsDark(false);
  }, []);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setColorScheme(next);
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
