import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "2xs": ["1.0rem", "1.2rem"],
        xs: ["1.2rem", "1.4rem"],
        sm: ["1.4rem", "1.7rem"],
        base: ["1.6rem", "1.9rem"],
        lg: ["1.8rem", "2.1rem"],
        xl: ["2.0rem", "2.4rem"],
        "2xl": ["2.2rem", "2.6rem"],
      },
    },
    // TODO: 암장 난이도별 색상 팔레트 추가
    colors: {
      ink: {
        DEFAULT: "#292929",
      },
      primary: {
        dark: "#DB4368",
        DEFAULT: "#FF5C75",
        light: "#FF848C",
        lighter: "#FFA09D",
        lightest: "#FFC6BD",
      },
      shadow: {
        darkest: "#292929",
        darker: "#565656",
        dark: "#797979",
        DEFAULT: "#B3B3B3",
        light: "#CCCCCC",
        lighter: "#F2F4F5",
        lightest: "#FAFAFA",
      },
      green: {
        dark: "#198155",
        DEFAULT: "#23C16B",
        light: "#4CD471",
        lighter: "#7DDE86",
        lightest: "#ECFCE5",
      },
      red: {
        dark: "#D3180C",
        DEFAULT: "#FF5247",
        light: "#FF6D6D",
        lighter: "#FF9898",
        lightest: "#FFE5E5",
      },
      yellow: {
        DEFAULT: "#FFB323",
        light: "#FEBD54",
        lightest: "#FFEFD7",
      },
      blue: {
        lightest: "#C9F0FF",
      },
      purple: {
        DEFAUlTL: "#6B4EFF",
      },
      "3rd-party": {
        kakao: "#FEE500",
        apple: "#000000",
      },
      white: "#FFFFFF",
      black: "000000",
    },
  },
  plugins: [],
};

export default config;
