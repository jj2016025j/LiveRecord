import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3045,
    proxy: {
      // "/": {
      //   target: "http://localhost:3045",
      //   changeOrigin: true,
      // },
      "/api": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/hubs": {
        target: "http://192.168.10.122:5555",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
