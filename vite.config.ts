import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    open: "org-html-theme-dull-pro.html",
  },
  server: {
    open: "./src/org-html-theme-dull-pro.html",
    hmr: false,
  },
  resolve: {
    alias: {
      "@/": path.join(__dirname, "./src/"),
    },
  },
  base: "./",
  root: "./",
  build: {
    outDir: "docs/",
    rollupOptions: {
      input: "./org-html-theme-dull-pro.html",
      output: {
        // 入口文件名
        entryFileNames: "[name].js",
        // 块文件名
        chunkFileNames: "[name]-[hash].js",
        // 资源文件名 css 图片等等
        // assetFileNames: 'assets/[name].[ext]',
        assetFileNames: (chunk) => {
					console.log(chunk);
          if (/css$/.test(chunk.name)) {
            return chunk.name;
          }

          return "assets/" + chunk.name;
        },
      },
    },
  },
});
