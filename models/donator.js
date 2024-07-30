const mongoose = require('mongoose');

const DonatorSchema = new mongoose.Schema({
    item_name: String,
    type: String,
    category: String,
    qtypp: Number,
    email: String,
    phone: Number,
    district: String,
    pickup_add: String,
  });

module.exports = mongoose.model('donator', DonatorSchema);