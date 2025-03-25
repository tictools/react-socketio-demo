import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:8888",
        ws: true,
      },
    },
  },
});
