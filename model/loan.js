const mongoose = require('mongoose');
const loanSchema = new mongoose.Schema({
  bankName: {
    type: String
  },
  rate: {
    type: String,
    required: true
  },
  installments: {
    type: Number
  },
  processingFee: {
   type : Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  Tenure: {
    type : Number
  },
  email: {
    type: String,
    required : true
  },
  maxAmount: {
    type: Number          
  },
  interest: {
    type : Number
  }

});
const Loan = mongoose.model('loan', loanSchema);
module.exports = {
  Loan
}