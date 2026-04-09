import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/domains/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /**
       * 타이포그래피 스케일
       * - Airbnb Cereal VF 기반, rem 단위 (html 62.5% 기준)
       * - 웨이트 500(medium)~700(bold) 범위 사용
       * - 헤딩에 네거티브 letter-spacing 적용
       */
      fontSize: {
        /* Micro Uppercase: 8px / 10px */
        micro: ["0.8rem", { lineHeight: "1.0rem", letterSpacing: "0.032rem" }],
        /* Badge: 11px / 13px */
        badge: ["1.1rem", { lineHeight: "1.3rem" }],
        /* Tag: 12px / 16px */
        tag: ["1.2rem", { lineHeight: "1.6rem" }],
        /* Small: 13px / 16px */
        sm: ["1.3rem", { lineHeight: "1.6rem" }],
        /* Body / Link: 14px / 20px */
        base: ["1.4rem", { lineHeight: "2.0rem" }],
        /* Body Medium: 14px / 18px */
        "base-tight": ["1.4rem", { lineHeight: "1.8rem" }],
        /* Caption Salt: 14px / 20px (font-feature-settings: "salt") */
        caption: ["1.4rem", { lineHeight: "2.0rem" }],
        /* UI Medium / Button: 16px / 20px */
        ui: ["1.6rem", { lineHeight: "2.0rem" }],
        /* Feature Title: 20px / 24px */
        feature: [
          "2.0rem",
          { lineHeight: "2.4rem", letterSpacing: "-0.018rem" },
        ],
        /* Sub-heading: 21px / 30px */
        subheading: ["2.1rem", { lineHeight: "3.0rem" }],
        /* Card Heading: 22px / 26px */
        card: ["2.2rem", { lineHeight: "2.6rem", letterSpacing: "-0.044rem" }],
        /* Section Heading: 28px / 40px */
        section: ["2.8rem", { lineHeight: "4.0rem" }],
      },
      /**
       * 폰트 패밀리
       * - Airbnb Cereal VF → Circular → 시스템 폰트 폴백
       */
      fontFamily: {
        cereal: [
          "Airbnb Cereal VF",
          "Circular",
          "-apple-system",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      /**
       * letter-spacing 토큰
       * - 헤딩용 네거티브 트래킹으로 따뜻하고 친밀한 느낌
       */
      letterSpacing: {
        tight: "-0.018rem",
        tighter: "-0.044rem",
      },
      /**
       * z-index 스택
       * - 기존 프로젝트 컨벤션 유지
       */
      zIndex: {
        navigation: "100",
        dropdown: "200",
        overlay: "300",
        floating: "400",
        tooltip: "500",
        notification: "600",
        critical: "900",
      },
      /**
       * 섀도우 시스템
       * - Airbnb 3-layer 카드 섀도우: border ring + soft blur + stronger blur
       * - 따뜻하고 자연스러운 깊이감
       */
      boxShadow: {
        /* Level 1: 카드, 검색바 — 3-layer warm lift */
        card: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px",
        /* Level 2: 버튼 호버, 인터랙티브 리프트 */
        hover: "rgba(0,0,0,0.08) 0px 4px 12px",
        /* Level 3: 포커스 링 */
        focus: "rgb(255,255,255) 0px 0px 0px 4px",
        /* 기존 프로젝트 호환 */
        "white-top":
          "0px -25px 25px rgba(255, 255, 255, 0.4), 0px -10px 10px rgba(255, 255, 255, 0.9)",
      },
      /**
       * 보더 라디우스 스케일
       * - Airbnb: 넉넉한 라운딩이 핵심 (20px+ 카드)
       */
      borderRadius: {
        /* Subtle: 작은 링크 */
        subtle: "0.4rem",
        /* Standard: 버튼, 탭, 검색 요소 */
        standard: "0.8rem",
        /* Badge: 상태 뱃지, 라벨 */
        badge: "1.4rem",
        /* Card: 피처 카드, 큰 버튼 */
        card: "2.0rem",
        /* Large: 큰 컨테이너, 히어로 요소 */
        large: "3.2rem",
        /* Circle: 네비 컨트롤, 아바타, 아이콘 */
        circle: "50%",
      },
      /**
       * 스페이싱 시스템
       * - 8px 기본 단위 기반
       */
      spacing: {
        "0.5": "0.2rem",
        "0.75": "0.3rem",
        "1": "0.4rem",
        "1.5": "0.6rem",
        "2": "0.8rem",
        "2.5": "1.0rem",
        "2.75": "1.1rem",
        "3": "1.2rem",
        "3.75": "1.5rem",
        "4": "1.6rem",
        "5.5": "2.2rem",
        "6": "2.4rem",
        "8": "3.2rem",
      },
      /**
       * 배경 이미지
       * - 기존 프로젝트 호환
       */
      backgroundImage: {
        "card-gradient":
          "linear-gradient(360deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.35) 16%, rgba(255, 255, 255, 0) 31.5%)",
      },
    },
    /**
     * 컬러 팔레트
     * - Airbnb 팔레트 기반 토큰 시스템
     * - Rausch Red (#ff385c) 단일 브랜드 액센트
     * - Near Black (#222222) 따뜻한 텍스트
     */
    colors: {
      transparent: "transparent",
      current: "currentColor",

      /* 브랜드 프라이머리 — Rausch Red */
      primary: {
        DEFAULT: "#ff385c",
        dark: "#e00b41",
      },

      /* 텍스트 스케일 — 따뜻한 near-black 기반 */
      ink: {
        DEFAULT: "#222222",
        focused: "#3f3f3f",
        secondary: "#6a6a6a",
        disabled: "rgba(0,0,0,0.24)",
        "link-disabled": "#929292",
      },

      /* 에러 */
      error: {
        DEFAULT: "#c13515",
        hover: "#b32505",
      },

      /* 프리미엄 티어 */
      luxe: "#460479",
      plus: "#92174d",

      /* 인터랙티브 */
      legal: "#428bff",

      /* 서피스 & 보더 */
      surface: {
        DEFAULT: "#ffffff",
        secondary: "#f2f2f2",
        border: "#c1c1c1",
      },

      /* 시맨틱 컬러 */
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
        DEFAULT: "#6B4EFF",
      },

      /* 서드파티 OAuth */
      "3rd-party": {
        kakao: "#FEE500",
        apple: "#000000",
      },

      /* 암장 난이도별 색상 팔레트 */
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

      /* 기본 컬러 */
      white: "#ffffff",
      black: "#000000",
      gray: "#c5c5c5",

      /* 뉴트럴 (기존 shadow 팔레트 호환) */
      shadow: {
        darkest: "#292929",
        darker: "#565656",
        dark: "#797979",
        DEFAULT: "#B3B3B3",
        light: "#CCCCCC",
        lighter: "#F2F4F5",
        lightest: "#FAFAFA",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["bg-opacity"],
    },
  },
  plugins: [
    /**
     * Airbnb OpenType "salt" (stylistic alternates) 유틸리티
     * - 뱃지, 캡션 등 특정 UI 요소에 미묘한 글리프 변형 적용
     */
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".font-salt": {
          fontFeatureSettings: '"salt"',
        },
      });
    }),
  ],
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
