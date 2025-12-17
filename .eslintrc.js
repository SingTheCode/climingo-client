module.exports = {
  extends: [
    "next/core-web-vitals",
    "next",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["prettier"],
  rules: {
    // typescript-eslint rule을 정의하기 위해 기존 규칙 off
    "no-unused-vars": "off",
    // 사용하지 않은 변수(인자)가 있으면 에러, _로 시작하는 변수(인자)는 무시
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
      },
    ],
    // useEffect의 deps에 필요없는 변수를 삽입하지 않은 경우
    "react-hooks/exhaustive-deps": "off",
  },
  overrides: [
    {
      // auth 도메인: 다른 도메인 참조 금지 (같은 도메인 내부는 허용)
      files: ["src/domains/auth/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@/domains/!(auth)/**"],
                message:
                  "도메인 간 직접 참조 금지. 페이지에서 조립하거나 공통 types(@/types)만 참조하세요.",
              },
            ],
          },
        ],
      },
    },
    {
      // record 도메인: 다른 도메인 참조 금지
      files: ["src/domains/record/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@/domains/!(record)/**"],
                message:
                  "도메인 간 직접 참조 금지. 페이지에서 조립하거나 공통 types(@/types)만 참조하세요.",
              },
            ],
          },
        ],
      },
    },
    {
      // profile 도메인: 다른 도메인 참조 금지
      files: ["src/domains/profile/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@/domains/!(profile)/**"],
                message:
                  "도메인 간 직접 참조 금지. 페이지에서 조립하거나 공통 types(@/types)만 참조하세요.",
              },
            ],
          },
        ],
      },
    },
    {
      // place 도메인: 다른 도메인 참조 금지
      files: ["src/domains/place/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@/domains/!(place)/**"],
                message:
                  "도메인 간 직접 참조 금지. 페이지에서 조립하거나 공통 types(@/types)만 참조하세요.",
              },
            ],
          },
        ],
      },
    },
    {
      // jjikboul 도메인: 다른 도메인 참조 금지
      files: ["src/domains/jjikboul/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@/domains/!(jjikboul)/**"],
                message:
                  "도메인 간 직접 참조 금지. 페이지에서 조립하거나 공통 types(@/types)만 참조하세요.",
              },
            ],
          },
        ],
      },
    },
    {
      // components, hooks 폴더에서 도메인 import 금지
      files: ["src/components/**/*", "src/hooks/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@/domains/**"],
                message:
                  "공통 컴포넌트/훅에서 도메인 참조 금지. types, utils만 참조 가능합니다.",
              },
            ],
          },
        ],
      },
    },
  ],
};
