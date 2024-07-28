const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongourl = process.env.MONGO_URL;

mongoose.connect(`${mongourl}`);

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone_no: Number,
    password: String
})

module.exports = mongoose.model('user', UserSchema);