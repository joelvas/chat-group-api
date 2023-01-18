import express, { Express } from 'express'
import cors from 'cors'
import { createServer, Server as HttpServer } from 'http'
import { socketController } from '../sockets/controller.js'
import { dbConnection } from '../database/config.js'
import fileUpload from 'express-fileupload'
import { Server as SocketServer } from 'socket.io'
import { Paths } from '../interfaces/paths.interface.js'
import authRoute from '../routes/auth.js'
import userRoute from '../routes/users.js'
import channelRoute from '../routes/channels.js'

class Server {
  app: Express
  server: HttpServer
  io: SocketServer
  port: number
  path: Paths
  constructor() {
    this.app = express()
    this.server = createServer(this.app)
    this.io = new SocketServer(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })
    this.port = Number(process.env.PORT) || 8080
    this.path = {
      auth: '/api/auth',
      users: '/api/users',
      channels: '/api/channels'
    }
    this.database()
    this.middlewares()
    this.routes()
    this.sockets()
  }
  async database() {
    await dbConnection()
  }
  middlewares() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('public'))
    this.app.use(fileUpload({ useTempFiles: true }))
  }
  routes() {
    this.app.use(this.path.auth, authRoute)
    this.app.use(this.path.users, userRoute)
    this.app.use(this.path.channels, channelRoute)
  }
  sockets() {
    this.io.on('connection', (socket) => {
      socketController(socket, this.io)
    })
  }
  listen() {
    this.server.listen(this.port, () => {
      console.log('Server running on port', this.port)
    })
  }
}

export default Server
