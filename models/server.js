const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { socketController } = require('../sockets/controller')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')
class Server {
  constructor() {
    this.app = express()
    this.server = createServer(this.app)
    this.io = require('socket.io')(this.server, {
      cors: {
        origin: "*",
        methods: ['GET', 'POST']
      }
    })
    this.port = process.env.PORT
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
    this.app.use(this.path.auth, require('../routes/auth'))
    this.app.use(this.path.users, require('../routes/users'))
    this.app.use(this.path.channels, require('../routes/channels'))
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

module.exports = Server
