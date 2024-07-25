import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        extend: {
            colors: {
                "defaultLight": "rgb(15, 16, 17)",
                "default": "rgb(10, 10, 10)",
                "borderDefault":"rgb(41, 41, 41)",
                "neonGreen":"rgb(31, 249, 173)",
                "neonRed":"rgb(255, 82, 105)",
                "textDefault":"rgb(220, 220, 220)",
            }
        },
    },
} satisfies Config

export default config