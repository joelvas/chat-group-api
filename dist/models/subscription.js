import { Schema, model } from 'mongoose';
const SubscriptionSchema = new Schema({
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
SubscriptionSchema.methods.toJSON = function () {
    const { __v, updated_at, ...subscription } = this.toObject();
    return subscription;
};
export default model('Subscription', SubscriptionSchema);
