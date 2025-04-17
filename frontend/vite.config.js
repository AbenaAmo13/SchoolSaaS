import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const frontendPort = parseInt(env.VITE_APP_FRONTEND_PORT)

  return {
    plugins: [react()],
    server: {
      host: true,
      port: frontendPort,
      watch:{
        usePolling:true,
      }
    }
  }
})
