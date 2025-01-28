'use client';

import { ThemeProvider } from "@mui/material";
import { theme } from "@/config/theme";
import { PoppinsRegular } from "@/fonts";

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <body className={PoppinsRegular.className}>{children}</body>
    </ThemeProvider>
  );
}
