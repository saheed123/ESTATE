const mongoose = require('mongoose');
const token = require('jsonwebtoken');
//  const auto = require('mongoose-auto-increment');

require('dotenv').config();
//   var connection = mongoose.createConnection(process.env.mongoURI);

//  auto.initialize(connection);



const propertySchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,

  },
  price: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum : ['tenement', 'independent',],
    required: true
  },
  Area: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true,
    unique : true
  },
  status: {
    type: String,
    enum: ['sold', 'available', 'in-view'],
    default: 'available'
    
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  propertyName:{
   type: String
  },
  propertyBhk:{
  type: Number
  },
 

  date: {
    type: Date,
  },
  currency: {
    type: String,
    enum : ["£","€","$","¥", "₦"],
    default : "₦"
  }



 
});



















const Property = mongoose.model('property', propertySchema);








module.exports = {
  Property,
  propertySchema

};
