const mongoose = require("mongoose");
const HostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  distance: { type: Number },

  fromCoords: {
    lat: { type: Number },
    lng: { type: Number }
  },
  toCoords: {
    lat: { type: Number },
    lng: { type: Number }
  },

  rideDate: { type: Date, required: true },
  openseats: { type: Number, min: [0, 'Open seats cannot be negative'], required: true },
  message: {
    type: String,
    default: function () {
      return `Ride from ${this.from} to ${this.to}. Seats available: ${this.openseats}.`;
    }
  },
  phone: { type: String },
  preferences: {
    music: Boolean,
    smoking: Boolean,
    pets: Boolean
  },
  intermediateStops: [
    {
      address: { type: String, required: true },
      lat: { type: Number }, 
      lng: { type: Number }, 
    }
  ],
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ChatRoom: { type: Boolean, default: false },
  chatRoomId: { type: String }
}, { timestamps: true });

const RideModel = mongoose.model('Host', HostSchema);
module.exports = RideModel;