import { defineConfig } from "vite";
import svgUse from "@svg-use/vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgUse()],
});
