import type { Config } from "jest";

const config: Config = {
  roots: ["<rootDir>/test/unit", "<rootDir>/test/integration"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/test/(.*)$": "<rootDir>/test/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};

export default config;
