import { Schema, model } from 'mongoose';
const LogSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    login_at: {
        type: String,
        default: Date.now
    },
});
LogSchema.methods.toJSON = function () {
    const { __v, ...log } = this.toObject();
    return log;
};
export default model('Log', LogSchema);
