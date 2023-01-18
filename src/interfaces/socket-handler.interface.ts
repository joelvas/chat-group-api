import { Server, Socket } from 'socket.io'
import { IUser } from './user.interface.js'
export interface SocketHandler {
  user: IUser
  io: Server
  socket: Socket
}
