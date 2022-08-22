const mongoose = require('mongoose');
const token = require('jsonwebtoken');
//  const auto = require('mongoose-auto-increment');

require('dotenv').config();
//   var connection = mongoose.createConnection(process.env.mongoURI);

//  auto.initialize(connection);



const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,

  },
  lastname: {
    type: String,
    required: true
  },
  othernames: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  confirm: {
    type: String,
    required: true


  },
  phone: {
    type: Number,
    required: true
  },
  address: {
    type: String
  },

  city: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  placeOfBirth: {
    type: String,
    required: true
  },

  userType: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  property: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'property'
  }],

  isApproved: {
    type: Boolean,
    default: true
  },
  annualincome: {
    type: Number
  },
  occupation: {
    type: String
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction"
  }],
  account_balance: {
    type: Number
  },
  
  
}, {timestamps : true});














userSchema.methods.generateToken = function () {
  const accessToken = token.sign({
    _id: this._id,

    isApproved: this.isApproved,
    userType: this.userType,
    firstname: this.firstname,
    lastname: this.lastname,
    othernames: this.othernames
  }, process.env.JWT_SEC, {
    expiresIn: '2d'
  });
  return accessToken;

}




userSchema.methods.fullname = function () {
  return ` ${this.firstname} ${this.lastname} ${this.othernames}`;
}
//   bankSchema.plugin(auto.plugin, {
//   model: "Bank",
//   field: "code",
//   startAt: 2460
// })
// accountSchema.plugin(auto.plugin, {
//   model: 'Account',
//   field: 'accountNumber',
//   startAt: 40000 000,
//   incrementBy: 1
// });


// branchSchema.plugin(auto.plugin, {
//   model: 'Branch',
//   field: 'branch_code',
//   startAt: 0001,
//   incrementBy: 1
// });
const User = mongoose.model('User', userSchema);








module.exports = {
  User,
  userSchema

};