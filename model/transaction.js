const mongoose = require("mongoose");


require("dotenv").config;
const transactionSchema = new mongoose.Schema({
  
  refNumber: {
   type: Number
  },
  status: {
    type: String,
    enum: ['successful', 'pending'],
    default: "pending",
    
  },
  amount: {
    type: Number,
    defalt : 0
  },
  bankName: {
    type: String
  },
  dateOfTransaction: {
    type: Date,
    default: Date.now
  },
  mode: {
    type: String,
    enum: ['card', 'cheque', 'cash'],
    default : "cash"
  }

  ,
  action: {
    type: String,
    
  },
  fullname: {
    type : String
  }
  


});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = {
  Transaction,transactionSchema
}