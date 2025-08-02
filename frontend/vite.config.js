import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const frontendPort = parseInt(env.VITE_APP_FRONTEND_PORT)

  return {
    base: './', // <-- important
    plugins: [react()],
    server: {
      host: true, // Allow access from Docker container
      port: frontendPort,
      watch:{
        usePolling:true,
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/tests/setupTests.ts',
    },
  }
})
