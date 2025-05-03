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
      host: '0.0.0.0', // Allow access from Docker container
      port: frontendPort,
      watch:{
        usePolling:true,
      },
      fs: {
        cachedChecks: false
      }
    },
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
    }
    
  }
})
