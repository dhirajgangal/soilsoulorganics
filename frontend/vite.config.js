import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite serves the React app on http://localhost:5173.
// The proxy is a spare path: if VITE_API_URL is empty, requests to /api
// are forwarded to FastAPI. The app normally calls FastAPI directly.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
