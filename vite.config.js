import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

export default defineConfig({
  // vite-plugin-cesium copies Cesium's static assets (workers, imagery
  // renderer, widget skin) into the build and points window.CESIUM_BASE_URL
  // at them, which the raw "cesium" package needs to run in the browser.
  plugins: [react(), cesium()],
})
