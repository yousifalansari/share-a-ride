const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  origin: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  departureDateTime: {
    type: Date,
    required: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
    min: 1,
  },
  pricePerSeat: {
    type: Number,
    default: 0,
    min: 0,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
