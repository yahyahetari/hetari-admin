import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      "heading1-bold": [
        "50px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "heading2-bold": [
        "30px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "heading3-bold": [
        "24px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "heading4-bold": [
        "20px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "body-bold": [
        "18px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "body-semibold": [
        "18px",
        {
          lineHeight: "100%",
          fontWeight: "600",
        },
      ],
      "body-medium": [
        "18px",
        {
          lineHeight: "100%",
          fontWeight: "500",
        },
      ],
      "base-bold": [
        "16px",
        {
          lineHeight: "100%",
          fontWeight: "600",
        },
      ],
      "base-medium": [
        "16px",
        {
          lineHeight: "100%",
          fontWeight: "500",
        },
      ],
    },

    extend: {
      colors: {
        "white-1": "#F8F8F8",
        "grey-1": "#616161",
        "grey-2": "#BDBDBD",
        "grey-3": "#E0E0E0",
        "blue-1": "#005EBE",
        "blue-2": "#E9F5FE",
        "blue-3": "#F5F7F9",
        "green": "#00281f",
        "red-1": "#FF0000",
        "dark": "#353535",
        "light": "#706d6f",
      },
      backgroundImage: {
        "gradient-blue": "linear-gradient(-90deg, #1e40af, #000000)",
        "gradient-green": "linear-gradient(-90deg,#00bf8f, #000000)",
        "gradient-red": "linear-gradient(-90deg,#ff0000, #000000)",
        "gradient-yellow": "linear-gradient(-90deg,#ffcc00, #000000)",
        'custom-bg': "url('/thu.jpg')",
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.2)',
      },
      backdropBlur: {
        'glass': '100px',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.3)',
      },
    },
  },
  plugins: [],
};
export default config;
