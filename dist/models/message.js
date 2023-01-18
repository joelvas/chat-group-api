import { Schema, model } from 'mongoose';
const MessageSchema = new Schema({
    text: {
        type: String,
        required: [true, 'Text is required.']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: 'Channel'
    },
    created_at: {
        type: String,
        default: Date.now
    }
});
MessageSchema.methods.toJSON = function () {
    const { __v, updated_at, ...message } = this.toObject();
    return message;
};
MessageSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
MessageSchema.set('toJSON', {
    virtuals: true
});
MessageSchema.set('toObject', { virtuals: true });
export default model('Message', MessageSchema);
