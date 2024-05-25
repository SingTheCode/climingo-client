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
};
