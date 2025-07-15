const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Host', required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, 
{ timestamps: true });

const ChatRoomModel = mongoose.model('ChatRoom', ChatRoomSchema);
module.exports = ChatRoomModel;
