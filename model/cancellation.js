const mongoose = require('mongoose');
const cancellationSchema = new mongoose.Schema({
  propertyName: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'property'

  },
  customerName: {
    type: mongoose.Schema.Types.ObjectId,

    ref: 'customer'
  },
  date: {
    type: Date,
    default : Date.now
  },
  amtRefund: {     
    type : Number
  },
  refNumber: {
   type : Number
  }




});
const cancellation = mongoose.model('cancellation', cancellationSchema);
module.exports = {
  cancellation
}