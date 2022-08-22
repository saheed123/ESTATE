const {
  User
} = require('../model/user');
const {
  Property

} = require('../model/property');
const mongoose = require('mongoose');

const {
  reg
} = require("../model/registration");
const {
  Transaction
} = require("../model/transaction");

const bcrypt = require('bcrypt');
var digits = Math.floor(Math.random() * 9000000000 + 1000000000);




const {
  validationResult
} = require('express-validator');
exports.postUser = async (req, res) => {




  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }

  var user = new User(req.body);




  user.password = await bcrypt.hash(user.password, 10);
  user.confirm = user.password;
  const token = user.generateToken();
  const fullname = user.fullname();


  user.image = req.file.path;
  const {
    _id,
    password,
    confirm,
    userType,
    account_balance,
    ...other
  } = user._doc;
  try {

    await user.save();
    res.header('x-auth-token', token).status(200).json({
      ...other,
      token,
      fullname,

    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message
    });

  }




}
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  try {

    const user = await User.findOne({
      email: req.body.email
    });
    if (!user)
      return res.status(400).send('invalid!!! email not registered');
    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if (!validatePassword) {
      return res.status(400).send('invalid password');
    }
    const accessToken = user.generateToken();

    const {
      _id,
      password,
      confirm,
      city,
      address,
      account_balance,
      userType,
      ...other
    } = user._doc;
    res.header('x-auth-token', accessToken).status(200).json({
      ...other,
      accessToken
    });





  } catch (error) {
    res.status(500).json(error.message);

  }





}
exports.updateUser = async (req, res) => {
  if (!Types.ObjectId.isValid(req.user._id)) {
    return res.status(404).json({ message: "not found" });
  }


  if (req.body.password) {
    req.body.password = bcrypt.hash(req.body.password, 10)
  }
  try {
    const updateUser = await User.findOneAndUpdate(req.user._id, {
      $set: req.body
    }, {
      new: true
    });
    updateUser ? res.status(200).json({
      message: 'successfully updated'
    }) : res.status(400).json({
      message: 'not found'
    });

  } catch (error) {
    res.status(500).json(error);

  }

}
exports.deleteUser = async (req, res) => {

  try {



    await User.findByIdAndDelete({
      _id: req.user._id
    });
    await Property.deleteMany({
      user: req.user._id
    });
    return res.status(200).json({
      message: 'successfully deleted'
    });



  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }




















}
exports.findUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user._id
    });
    const {
      password,
      confirm,
      userType,
      ...other
    } = user._doc;


    res.status(200).json({
      ...other
    });
  } catch (error) {
    res.status(500).jon({
      message: error.message
    });
  }

}
exports.logout = async (req, res) => {
  req.user = "";
  res.status(200).json({
    message: 'logout successfull'
  });

}
exports.findall = async (req, res) => {

  try {
    const user = await User.find({}, '-confirm -password -isAdmin');



    return res.status(200).json(user);



  } catch (error) {

    return res.status(500).json({
      message: error.message
    });


  }






}
exports.cusProperty = async (req, res) => {


  try {
    const getProp = await Property.findOne({
      _id: req.params.id
    });
    const no = {
      ...getProp
    }._doc;
    res.status(200).json(no);


  } catch (error) {
    res.status(500).json({
      message: error.message
    });

  }

}
exports.cusallProperty = async (req, res) => {

  try {
    const property = await Property.find({});
    return res.status(200).json(property);



  } catch (error) {

    return res.status(500).json({
      message: error.message
    });


  }
}
exports.registerProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
  const register = new reg({
    ...req.body
  });
  register.user = req.user._id;
  const property = await Property.findOne({
    propertyName: register.propertyName
  });
  if (!property)
    return res.status(400).json({
      message: 'not availabe property name'
    });

  register.amount = property.price;
  await register.save();

  const user = await User.findOne({_id : req.user._id});
  user.property.push(property);
  await user.save();
  res.status(200).json(register);
}
exports.transactions = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body
    });
    const regs = await reg.findById({
      _id: req.params.id
    });
    if (!regs) {
      return res.status(400).json({ message: `not available id ${regs._id}` })
    }
    const user = User.aggregate([{ $unwind: "$property" }, { $match: { property: mongoose.Types.ObjectId(regs['id']) } }]);
    
    if (user && regs.status === "approved") {
      transaction.fullname = `${req.user.firstname} ${req.user.lastname} ${req.user.othernames}`;
      transaction.refNumber = digits++;
      transaction.amount = regs.amount;
      if (transaction.status === 'approved') {
        transaction.action = 'you are already approved';
      }
      transaction.action = 'awaiting approval';
   


    } else if (!user && regs.status === 'pending') {
     return res.status(400).json({
        message: 'still pending... awaiting approval'
      });
    }

    await transaction.save();
    res.status(200).json({
      transaction
    })
  }
  catch (error) {
   return res.status(500).json({ message: error.message });
  }











}
exports.canceltransactions = async (req, res) => {
  try {
   await Transaction.findOneAndDelete({ _id: req.params.id });
    // if (transaction.status === 'pending') {
    //   const user = await User.findOne({ _id: req.user._id });
    //   user.transactions.push(transaction);
    //   await user.save();
    // }

    res.status(200).json({ message: "successfully deleted" });
    
  
  }
  catch (error) {
   return res.status(500).json({ message: error.message });
  }











}