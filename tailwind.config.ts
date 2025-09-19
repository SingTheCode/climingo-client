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
      zIndex: {
        navigation: "100",
        dropdown: "200",
        overlay: "300",
        floating: "400",
        tooltip: "500",
        notification: "600",
        critical: "900",
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
      level: {
        red: "#ff0000",
        orange: "#f77f00",
        yellow: "#ffff00",
        green: "#23C16B",
        blue: "#0000ff",
        navy: "#003077",
        purple: "#b266ff",
        pink: "#ff6666",
        brown: "#cc6600",
        grey: "#a0a0a0",
        white: "#ffffff",
        black: "#000000",
      },
      gray: "#c5c5c5",
      white: "#FFFFFF",
      black: "#000000",
    },
    boxShadow: {
      "white-top":
        "0px -25px 25px rgba(255, 255, 255, 0.4), 0px -10px 10px rgba(255, 255, 255, 0.9)",
    },
    backgroundImage: {
      "card-gradient":
        "linear-gradient(360deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.35) 16%, rgba(255, 255, 255, 0) 31.5%)",
    },
  },
  variants: {
    extend: {
      backgroundColor: ["bg-opacity"],
    },
  },
  plugins: [],
  safelist: [
    "bg-level-red",
    "bg-level-orange",
    "bg-level-yellow",
    "bg-level-green",
    "bg-level-blue",
    "bg-level-navy",
    "bg-level-purple",
    "bg-level-pink",
    "bg-level-brown",
    "bg-level-grey",
    "bg-level-white",
    "bg-level-black",
  ],
};

export default config;
