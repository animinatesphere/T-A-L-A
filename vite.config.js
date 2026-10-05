import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const paystackPublicKey = env.VITE_PAYSTACK_PUBLIC_KEY || "";

  if (/^sk_(live|test)_/.test(paystackPublicKey)) {
    throw new Error(
      "VITE_PAYSTACK_PUBLIC_KEY must contain a pk_live_ or pk_test_ public key, never an sk_ secret key.",
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  };
});
