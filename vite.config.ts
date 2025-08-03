import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Simple CSP for build time
const getCSPHeader = (mode: string) => {
  const baseCSP = "default-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';";
  
  if (mode === 'development') {
    return baseCSP + " script-src 'self' 'unsafe-inline' 'unsafe-eval' https://gnzcynuehkxbkfljaydx.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://gnzcynuehkxbkfljaydx.supabase.co wss://gnzcynuehkxbkfljaydx.supabase.co;";
  }
  
  return baseCSP + " script-src 'self' https://gnzcynuehkxbkfljaydx.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://gnzcynuehkxbkfljaydx.supabase.co wss://gnzcynuehkxbkfljaydx.supabase.co;";
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      // Content Security Policy (environment-specific)
      'Content-Security-Policy': getCSPHeader(mode)
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Security considerations for production builds
    rollupOptions: {
      output: {
        // Remove comments and console.log in production
        banner: '',
        footer: ''
      }
    },
    // Generate source maps for debugging but not in production
    sourcemap: mode === 'development'
  }
}));
