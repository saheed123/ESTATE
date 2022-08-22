const {
  User
} = require('../model/user');
const {
  Property

} = require('../model/property');
const mongoose = require("mongoose");
const {
  reg
} = require("../model/registration");
const {
  Loan
} = require("../model/loan");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');




const {
  validationResult
} = require('express-validator');
const {
  Transaction
} = require('../model/transaction');
exports.postAdmin = async (req, res, next) => {




  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }

  var user = new User(req.body);
  if (user.userType === 'customer') {
    return res.status(401).json({
      message: "you are not an admin"
    });
  }


  user.userType = 'admin';
  user.property = [];
  user.transactions = [];
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
exports.loginAdmin = async (req, res, next) => {
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
exports.updateAdmin = async (req, res) => {


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
exports.postProperty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }

  const property = new Property(req.body);
  property.user = req.user._id;
  property.img = req.file.path;

  try {


    await property.save();
    const user = await User.findById({
      _id: property.user
    });
    await user.save();
    res.status(200).json(property);



  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }




















}

exports.findall = async (req, res, next) => {

  try {
    const user = await User.find({}, '-confirm -password -userType');



    return res.status(200).json(user);



  } catch (error) {

    return res.status(500).json({
      message: error.message
    });


  }






}
exports.postLoans = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
  const loan = new Loan(req.body);
  loan.user = req.user._id;
  try {
    await loan.save();
    return res.status(200).json({
      message: loan
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
exports.updateLoans = async (req, res, next) => {


  try {
    const updateUser = await Loan.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: req.body
    }, {
      upsert: true
    });
    updateUser ? res.status(200).json({
      message: 'successfully updated'
    }) : res.status(400).json({
      message: 'not found'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });

  }

}
exports.updateProperty = async (req, res, next) => {


  try {
    const updateUser = await Property.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: req.body
    }, {
      upsert: true
    });
    updateUser ? res.status(200).json({
      message: 'successfully updated'
    }) : res.status(400).json({
      message: 'not found'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });

  }

}
exports.deleteProperty = async (req, res, next) => {


  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    await Property.findByIdAndDelete({
      _id: id
    });

    const user = await User.findOne({
      _id: id
    });
    user.property.pull(id);
    await user.save();

  } catch (error) {
    res.status(500).json({
      message: error.message
    });

  }

}
exports.getProperty = async (req, res, next) => {


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
exports.deleteLoans = async (req, res, next) => {


  try {
    const getProp = await Loan.findByIdAndDelete({
      _id: req.params.id
    });
    getProp ? res.status(200).json({
      message: 'successfully deleted'
    }) : res.status(400).json({
      message: 'not found'
    });


  } catch (error) {
    res.status(500).json({
      message: error.message
    });

  }

}
exports.findallProperty = async (req, res, next) => {

  try {
    const property = await Property.find({});



    return res.status(200).json(property);



  } catch (error) {

    return res.status(500).json({
      message: error.message
    });


  }






}
exports.approveRegistration = async (req, res, next) => {
  try {
    const user = User.findOne({
      _id: req.user._id
    });
    if (!user) {
      return res.status(400).json({
        message: 'invalid user'
      });
    }

    var property = await reg.findOneAndUpdate(req.params.id, {
      status: 'approved'
    }, {
      new: true
    });
    res.status(200).json(property);


  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
exports.approveTransaction = async (req, res, next) => {
  try {

    const transaction = await Transaction.findOne({
      _id: req.params.id
    });
    transaction.status = "successful";
    transaction.action = 'approved'
    const user = await User.findOne({
      _id: req.user._id
    });
    user.account_balance = transaction.amount;
    user.transactions.push(transaction);
    await user.save();
    await transaction.save();
    res.status(200).json(transaction);


  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
exports.countTransaction = async (req, res, next) => {
  try {

    const transaction = await Transaction.find({
      status: "successful"
    }).count();
    res.status(200).json({
      approve: transaction
    });


  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
exports.pendingTransaction = async (req, res, next) => {
  try {

    const transaction = await Transaction.find({
      status: "pending"
    }).count();
    res.status(200).json({
      pending: transaction
    });


  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
exports.countUser = async (req, res, next) => {
  const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

   
  try {
    const customer = await User.aggregate([{ $match: { userType: "customer", createdAt: { $gte: lastYear } } }, {
      $group: {
        _id: {
          $month: "$createdAt"
        },
        
        total: {
        
          $sum: 1
        }
      }
    }]);
    res.status(200).json({
      customer
    });


  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
exports.countDays = async (req, res, next) => {
  try {

    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    const days = await User.aggregate([{
      $match: {
        createdAt: {
          $gte: lastYear
        }
      }
    }, {
      $group: {
        _id: {
          $month: "$createdAt"
        },
        total: {
          $sum: 1
        }
      }
    }]);
    res.status(200).json(days);


  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

exports.countIncome = async (req, res, next) => {
  try {

    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

    const days = await User.aggregate([{
      $match: {
        userType: "admin",
        createdAt: {
          $gte: prevMonth
        }
      }
    }, {
      $group: {
        _id: {
          $month: "$createdAt"
        },
        total: {
          $sum: "$account_balance"
        }
      }
    }]);
    res.status(200).json(days);


  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}