const Configuration = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "chore", "docs", "style"],
    ],
    "scope-empty": [2, "always"],
    "subject-empty": [2, "always"],
    "type-empty": [2, "always"],
    "header-custom": [2, "always"],
    // 커스텀 규칙을 직접 정의하는 대신 기본 규칙을 활용
  },
  plugins: [
    {
      rules: {
        "header-custom": (parsed) => {
          if (!parsed.header) {
            return [false, "header is empty"];
          }
          const pattern =
            /^\[#\d+\]\s(feat|fix|refactor|chore|docs|style):\s.+/;
          const match = pattern.test(parsed.header);
          return [match, `header does not match pattern ${pattern.toString()}`];
        },
      },
    },
  ],
};

export default Configuration;
