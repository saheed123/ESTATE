const mongoose = require('mongoose');
const token = require('jsonwebtoken');
const {
  User
} = require('./user');
//  const auto = require('mongoose-auto-increment');

require('dotenv').config();
//   var connection = mongoose.createConnection(process.env.mongoURI);

//  auto.initialize(connection);



const regSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'

  },
  propertyName: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: {
    type: Number
  }

}, {
  timestamps: true
});



















const reg = mongoose.model('registration', regSchema);








module.exports = {
  reg,
  regSchema

};