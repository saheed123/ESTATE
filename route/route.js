const express = require('express');

const route = express.Router();
const multer = require('multer');
const resetPassword = require('../controller/passwordReset');
const changePassword = require('../controller/changePassword');
const {
  loginUser,
  updateUser,
  deleteUser,
  findUser,
  postUser,
  logout,
  findall,
  cusProperty,
  cusallProperty,
  registerProperty,
  transactions,
  canceltransactions
} = require('../controller/user');

 const {
   verifyToken
 } = require('../config/verifyToken');
 const admin = require('../config/admin');
const {
  loginValidator,
  registerValidator,
  passwordReset,
  propertyValidator,
  branchValidation,
  bankValidation,
  transactValidation,
  loanValidator,
  regValidator
} = require('../config/validator');
const path = require('path');
const { postAdmin, loginAdmin, updateAdmin, postProperty, postLoans, updateLoans, updateProperty, deleteProperty, getProperty, deleteLoans, findallProperty, approveRegistration, approveTransaction, countTransaction, pendingTransaction, countUser, countDays, countIncome } = require('../controller/admin');
const { throws } = require('assert');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }
  cb(null, false);
}


const upload = multer({
  storage,
  fileFilter
});

// ORDINARY USERS ROUTE
route.post('/register/customer', upload.single('image'), registerValidator, postUser);
route.post('/login/customer', loginValidator, loginUser);
route.post('/passwordReset', passwordReset, resetPassword);
route.post('/passwordReset/:userId/:token', changePassword);
route.put('/register/update', registerValidator, verifyToken, updateUser);
route.delete('/register/delete', verifyToken, deleteUser);
route.get('/me', verifyToken, findUser);
route.get('/all/user', [verifyToken, admin], findall);
route.get('/logout', verifyToken, logout);
route.post('/post/transaction/:id', verifyToken, transactions);
route.delete('/cancel/transaction/:id', verifyToken, canceltransactions);

                               // Admin route 
route.post('/register/admin', upload.single('image'), registerValidator, postAdmin);
route.post('/login/admin', loginValidator, loginAdmin);
route.put('/register/update', registerValidator, verifyToken, updateAdmin);
route.post('/approve/registration/:id', verifyToken,admin, approveRegistration );
route.post('/approve/transaction/:id', verifyToken, admin, approveTransaction);
route.post('/approve/count/transaction', verifyToken, admin, countTransaction);
route.post('/pending/count/transaction', verifyToken, admin, pendingTransaction);
route.post('/user/count', verifyToken, admin, countUser);
route.post('/user/days', verifyToken, admin, countDays);
route.post('/user/income', verifyToken, admin, countIncome);

 
                              // Property
                                                          
route.post('/post/property', upload.single('image'), [propertyValidator,verifyToken, admin], postProperty);
route.put('/update/property/:id', [verifyToken, admin], updateProperty);
route.delete('/delete/property/:id', [verifyToken, admin], deleteProperty);
route.get('/get/property/:id', [verifyToken, admin], getProperty);
route.get('/customer/property/:id', [verifyToken], cusProperty);
route.get('/customer/all/property', [verifyToken], cusallProperty);
route.get('/admin/property/all', [verifyToken,admin], findallProperty); 
     
                          //  Loans
route.post('/post/loans', loanValidator,verifyToken, admin, postLoans);
route.put('/update/loans/:id',verifyToken, admin, updateLoans);
route.delete('/delete/loans/:id',verifyToken, admin, deleteLoans);
                                  // Register Property
route.post('/register/property', [regValidator,verifyToken], registerProperty);




// route.post('/branch/add', branchValidation, addBranch);
// route.delete('/deleteBranch/:Id', [verifyToken], DeleteBranch);
// route.get('/branch/me/:id', getABranch);
// route.get('/allBranch', getAllBranch);
// route.delete('/allBranch/delete', [verifyToken], deleteAllBranch);

// //  EMPLOYEES ROUTE

// route.post('/register/employee', upload.single('image'), registerValidator, postEmployee);
// route.post('/user/deposit/employee/:id', depositforUser);
// route.post('/user/employee/transfer/:id', employeeTransfer);
// route.post('/login/employee', loginValidator, loginEmployee);
// route.delete('/register/employee/delete', verifyToken, deleteEmployee);
// route.get('/employee/me',[verifyToken], findEmployee);
// route.get('/employee/all', [verifyToken, admin], findallEmployee);
// route.put('/register/update/employee', registerValidator, verifyToken, updateEmployee);


// // ADD BANK

// route.post('/addBank', addBank);

// // DEPOSIT////////////////////////////////
// route.post('/deposit/:id', [transactValidation], deposit);
// route.delete('/deposit/delete/:id', deleteDeposit);
// route.delete('/deposit/deleteAll', deleteAllDeposit);
// route.get('/deposit/me/:id', getDeposit);
// route.get('/deposit/all', getAllDeposit);

// // WITHDRAW////////////////

// route.post('/withdraw/:id', withdraw);
// route.get('/getwithdraw/:id', getWithdraw);
// route.get('/Allwithdraw', getAllwithdraw);
// route.delete('/withdraw/delete/:id', deletewithdraw);
// route.delete('/withdraw/deleteAll', deleteAllwithdraw);

// // TRANSFER/////////////////////

// route.post('/transfer/:id', transfer);
// route.get('/transfer/me/:id', getTransfer);
// route.get('/transfer/all', getAllTransfer);
// route.delete('/transfer/deleteall', deleteAllTransfer);
// route.delete('/transfer/delete/:id', deleteTransfer);

//                                   // LOAN//////////////
// route.post('/loan/:id', [loanValidator,verifyToken, approved], postLoan);
// route.post('/loan/approve/:id', [verifyToken, admin], approveLoan);
// route.post('/loan/reject/:id', [verifyToken, admin], rejectLoan);
// route.get('/loan/findAll', [verifyToken], allLoans);
// route.get('/loan/filter', [verifyToken], filterLoans);

//                         //  AGENT ROUTE
// route.post('/agent/post', upload.single('image'), registerValidator, postAgent);

// route.post('/agent/login', loginAgent);
// route.get('/agent/list', [verifyToken, admin], agentRequestList);
// route.post('/agent/approve/:id', [verifyToken,admin], approveAgent);
// route.get('/agent/find', [verifyToken], findAgent);
// route.get('/agent/findall', [verifyToken, admin], findallAgent);
// route.delete('/agent/delete', [verifyToken], deleteAgent);
// route.post('/edit/loan/:id',[verifyToken, approved], editLoan);








module.exports = route;