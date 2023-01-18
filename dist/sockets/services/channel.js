import Channel from '../../models/channel.js';
import Subscription from '../../models/subscription.js';
import Message from '../../models/message.js';
import SocketResponse from '../../models/socket-response.js';
const fetchChannels = async () => {
    const channels = await Channel.find();
    return channels;
};
const onCreateChannel = async ({ io, user, socket }, payload, callback) => {
    if (payload.name === '')
        callback(new SocketResponse(false, 'Name is required.'));
    const channelExists = await Channel.find({ name: payload.name });
    if (channelExists)
        callback(new SocketResponse(false, 'Room already exists'));
    //regitering new channel in database
    const newChannel = new Channel(payload);
    await newChannel.save();
    //registering new sub in database channel
    const newSub = new Subscription({ user: user.id, channel: newChannel.id });
    await newSub.save();
    //registering in socket channel
    socket.join(newChannel.id);
    //sending new channel to everybody
    io.emit('new-channel', newChannel);
    //sending current channel to me
    callback(newChannel);
};
const onEditChannel = async ({ io, user, socket }, payload, callback) => {
    const channelExists = await Channel.findOne({ _id: payload._id });
    if (channelExists === null) {
        callback(new SocketResponse(false, 'Room does not exist'));
        return;
    }
    if (!!payload.password && payload.password !== '') {
        channelExists.password = payload.password;
        channelExists.private = true;
    }
    const channelUpdated = await Channel.findByIdAndUpdate(channelExists._id, channelExists, {
        new: false
    });
    io.emit('channel-updated', channelUpdated);
    callback(channelUpdated);
};
const onDeleteChannel = async ({ io }, payload, callback) => {
    await Channel.deleteOne({ _id: payload._id });
    io.emit('remove-channel', payload);
    callback(true);
};
const onJoinChannel = async ({ io, user, socket }, payload, callback) => {
    const channel = await Channel.findOne({ _id: payload._id });
    if (channel === null) {
        callback(new SocketResponse(false, 'Room does not exist'));
        return;
    }
    const isPasswordCorrect = payload.password == channel.password;
    const currentChannelSubs = await Subscription.find({
        channel: channel._id
    }).populate('user');
    const userSubscribed = currentChannelSubs.find((sub) => sub.user._id === user._id);
    if (!channel.private ||
        (channel.private && userSubscribed) ||
        (channel.private && isPasswordCorrect)) {
        socket.join(channel._id.toString());
        const currentMessages = await Message.find({
            channel: channel._id
        }).populate('user');
        socket.emit('current-messages', currentMessages.reverse());
        const currentMembers = currentChannelSubs
            ? currentChannelSubs.map((sub) => sub.user)
            : [];
        socket.broadcast.to(channel._id.toString()).emit('new-member', user);
        socket.emit('current-members', currentMembers);
        callback(new SocketResponse(true, 'You joined succesfully'));
    }
    else {
        callback(new SocketResponse(false, 'There was an error'));
    }
};
const onSuscribeChannel = async ({ io, user, socket }, payload, callback) => {
    const channel = await Channel.findOne({ _id: payload._id });
    if (channel === null) {
        callback(new SocketResponse(false, 'Room does not exist'));
        return;
    }
    const currentSub = await Subscription.findOne({
        channel: channel._id,
        user: user.id
    });
    if (currentSub) {
        callback(new SocketResponse(true, 'You subscribed successfully'));
    }
    else {
        const newSub = new Subscription({ user: user.id, channel: channel._id });
        await newSub.save();
        socket.broadcast.to(channel._id.toString()).emit('new-member', user);
        callback(new SocketResponse(true, 'You subscribed successfully'));
    }
};
const onSearchChannel = async ({ io, user, socket }, payload, callback) => {
    const channels = await Channel.find({
        name: { $regex: payload, $options: 'i' }
    });
    callback(channels);
};
const onUnsuscribeChannel = async ({ io, user, socket }, payload, callback) => {
    const channel = await Channel.findOne({ _id: payload._id });
    if (channel === null) {
        callback(new SocketResponse(false, 'Room does not exist'));
        return;
    }
    const currentSub = await Subscription.findOne({
        channel: channel._id,
        user: user.id
    });
    if (currentSub) {
        //removing last sub in database
        await Subscription.deleteOne({ _id: currentSub._id });
        //removing from user data
        io.to(currentSub.channel.toString()).emit('remove-member', user);
        //removing from socket channel
        io.in(socket.id).socketsLeave([currentSub.channel.toString()]);
        callback(new SocketResponse(true, 'You left successfully'));
    }
    else {
        callback(new SocketResponse(false, 'There was an error'));
    }
};
export { onCreateChannel, onEditChannel, onDeleteChannel, onJoinChannel, onSearchChannel, fetchChannels, onSuscribeChannel, onUnsuscribeChannel };
