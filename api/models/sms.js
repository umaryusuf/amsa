const mongoose = require('mongoose');

const smsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  location: {
    type: String,
    required: true
  },
  emergency: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  time: {
    type: Date,
    default: Date.now,
    required: true
  },
  response: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('SMS', smsSchema);