import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

// Figma Make 플러그인이 섞인 vite.config.ts 대신 별칭만 가진 가벼운 설정을 쓴다
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: { include: ["tests/**/*.test.ts"] },
})
