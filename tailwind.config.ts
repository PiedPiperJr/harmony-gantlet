import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary': {
          DEFAULT: '#23B9CA',
          'light': '#4ECDD4',
          'dark': '#007B8D'
        },
        'secondary': {
          DEFAULT: '#333333',
          'light': '#4F4F4F',
          'dark': '#1A1A1A'
        },
        'accent': {
          DEFAULT: '#DC3545',
          'light': '#FF4D5E',
          'dark': '#B22222'
        }
      },
    },
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
    },
    boxShadow: {
      'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
  },
  plugins: [],
} satisfies Config;
