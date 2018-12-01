const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facilitiesSchema = new Schema(
  {
    long: Number,
    lat: Number,
    facility: String,
    type: String,
    ownership: String,
    status: String,
    ward_code: String,
    ward_name: String,
    lga_code: Number,
    lga_name: String
  },
  {
    collection: 'facilities'
  }
)

module.exports = mongoose.model('facilities', facilitiesSchema);