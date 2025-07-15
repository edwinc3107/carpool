const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    ride:{type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required:true},
    message:{type: String},
    timesent:{type: Date, default: Date.now },
    sender:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true}
},{ timestamps: true })

const MessageModel = mongoose.model('Message', MessageSchema);
module.exports = MessageModel;