#!/bin/bash
set -e

echo "🔍 1단계: TypeScript 타입 체크..."
npx tsc --noEmit

echo "🔍 2단계: ESLint 검사..."
npm run lint

echo "🔍 3단계: Prettier 포맷팅 검사..."
npx prettier --check "src/**/*.{ts,tsx}"

echo "🔍 4단계: 빌드 검증..."
npm run build

echo "✅ 모든 검증 통과!"
