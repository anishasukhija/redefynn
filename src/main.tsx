import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/components/theme-provider'
import App from './App.tsx'
import './index.css'
import { validateEnvironment } from '@/lib/security-config'

// Validate environment variables before starting the app
const envValidation = validateEnvironment()
if (!envValidation.isValid) {
  console.error('Environment validation failed:', envValidation.errors)
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: system-ui;">
      <h1>Configuration Error</h1>
      <p>The application is not properly configured. Please check your environment variables.</p>
      <details style="margin-top: 20px;">
        <summary>Error Details</summary>
        <ul style="text-align: left; margin-top: 10px;">
          ${envValidation.errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
      </details>
    </div>
  `
  throw new Error('Environment validation failed')
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="redefynn-theme">
    <App />
  </ThemeProvider>
);
