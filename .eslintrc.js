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
      // domains/record 폴더 내에서 다른 도메인의 hooks, components, api import 금지
      files: ["src/domains/record/**/*"],
      excludedFiles: ["src/domains/record/types/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: [
                  "@/domains/auth/hooks/**",
                  "@/domains/auth/components/**",
                  "@/domains/auth/api/**",
                  "@/domains/profile/hooks/**",
                  "@/domains/profile/components/**",
                  "@/domains/profile/api/**",
                  "@/domains/place/hooks/**",
                  "@/domains/place/components/**",
                  "@/domains/place/api/**",
                  "@/domains/jjikboul/hooks/**",
                  "@/domains/jjikboul/components/**",
                  "@/domains/jjikboul/api/**",
                ],
                message: "도메인 간 직접 참조 금지. 페이지에서 조립하거나 공통 types만 참조하세요.",
              },
            ],
          },
        ],
      },
    },
    {
      // domains/auth 폴더 내에서 다른 도메인의 hooks, components, api import 금지
      files: ["src/domains/auth/**/*"],
      excludedFiles: ["src/domains/auth/types/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: [
                  "@/domains/record/hooks/**",
                  "@/domains/record/components/**",
                  "@/domains/record/api/**",
                  "@/domains/profile/hooks/**",
                  "@/domains/profile/components/**",
                  "@/domains/profile/api/**",
                  "@/domains/place/hooks/**",
                  "@/domains/place/components/**",
                  "@/domains/place/api/**",
                  "@/domains/jjikboul/hooks/**",
                  "@/domains/jjikboul/components/**",
                  "@/domains/jjikboul/api/**",
                ],
                message: "도메인 간 직접 참조 금지. 페이지에서 조립하거나 공통 types만 참조하세요.",
              },
            ],
          },
        ],
      },
    },
    {
      // domains/profile 폴더 내에서 다른 도메인의 hooks, components, api import 금지
      files: ["src/domains/profile/**/*"],
      excludedFiles: ["src/domains/profile/types/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: [
                  "@/domains/auth/hooks/**",
                  "@/domains/auth/components/**",
                  "@/domains/auth/api/**",
                  "@/domains/record/hooks/**",
                  "@/domains/record/components/**",
                  "@/domains/record/api/**",
                  "@/domains/place/hooks/**",
                  "@/domains/place/components/**",
                  "@/domains/place/api/**",
                  "@/domains/jjikboul/hooks/**",
                  "@/domains/jjikboul/components/**",
                  "@/domains/jjikboul/api/**",
                ],
                message: "도메인 간 직접 참조 금지. 페이지에서 조립하거나 공통 types만 참조하세요.",
              },
            ],
          },
        ],
      },
    },
    {
      // domains/place 폴더 내에서 다른 도메인의 hooks, components, api import 금지
      files: ["src/domains/place/**/*"],
      excludedFiles: ["src/domains/place/types/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: [
                  "@/domains/auth/hooks/**",
                  "@/domains/auth/components/**",
                  "@/domains/auth/api/**",
                  "@/domains/record/hooks/**",
                  "@/domains/record/components/**",
                  "@/domains/record/api/**",
                  "@/domains/profile/hooks/**",
                  "@/domains/profile/components/**",
                  "@/domains/profile/api/**",
                  "@/domains/jjikboul/hooks/**",
                  "@/domains/jjikboul/components/**",
                  "@/domains/jjikboul/api/**",
                ],
                message: "도메인 간 직접 참조 금지. 페이지에서 조립하거나 공통 types만 참조하세요.",
              },
            ],
          },
        ],
      },
    },
    {
      // domains/jjikboul 폴더 내에서 다른 도메인의 hooks, components, api import 금지
      files: ["src/domains/jjikboul/**/*"],
      excludedFiles: ["src/domains/jjikboul/types/**/*"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: [
                  "@/domains/auth/hooks/**",
                  "@/domains/auth/components/**",
                  "@/domains/auth/api/**",
                  "@/domains/record/hooks/**",
                  "@/domains/record/components/**",
                  "@/domains/record/api/**",
                  "@/domains/profile/hooks/**",
                  "@/domains/profile/components/**",
                  "@/domains/profile/api/**",
                  "@/domains/place/hooks/**",
                  "@/domains/place/components/**",
                  "@/domains/place/api/**",
                ],
                message: "도메인 간 직접 참조 금지. 페이지에서 조립하거나 공통 types만 참조하세요.",
              },
            ],
          },
        ],
      },
    },
  ],
};
