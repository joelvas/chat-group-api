import { validateJWT } from '../helpers/generate-jwt.js';
import { onCreateChannel, onEditChannel, onDeleteChannel, onJoinChannel, onSearchChannel, fetchChannels } from './services/channel.js';
import { onDisconnect } from './services/server.js';
import { onCreateMessage, onDeleteMessage } from './services/message.js';
const socketController = async (socket, io) => {
    const token = socket.handshake.headers['x-token'];
    const user = (await validateJWT(String(token)));
    if (!user) {
        return socket.disconnect();
    }
    console.log('user', user.name, 'connected');
    const socketHandler = { io, user, socket };
    const channels = await fetchChannels();
    socket.emit('channels-list', channels);
    socket.on('create-channel', (payload, callback) => onCreateChannel(socketHandler, payload, callback));
    socket.on('edit-channel', (payload, callback) => onEditChannel(socketHandler, payload, callback));
    socket.on('delete-channel', (payload, callback) => onDeleteChannel(socketHandler, payload, callback));
    socket.on('join-channel', (payload, callback) => onJoinChannel(socketHandler, payload, callback));
    socket.on('search-channel', (payload, callback) => onSearchChannel(socketHandler, payload, callback));
    socket.on('create-message', (payload, callback) => onCreateMessage(socketHandler, payload, callback));
    socket.on('delete-message', (payload, callback) => onDeleteMessage(socketHandler, payload, callback));
    socket.on('disconnect', (reason) => onDisconnect(socketHandler, reason));
};
export { socketController };
