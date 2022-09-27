const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const signUpValidation = [
    body('FirstName')
    .not().isEmpty().withMessage('First name is required'),
    body('LastName')
    .not().isEmpty().withMessage('Last name is required'),
    body('Email').isEmail().withMessage('Please enter a valid email').custom(async (email, { req }) => {
      const user =  await User.findOne({ 'Email': email });
      if (email !== undefined && user) {
          throw new Error('Email already exists');
      }
      return true;
    }),
    body('Password').isLength({ min: 4 }).withMessage('Password should be minimum 4 characters'),
    body('ConfirmPassword').custom((value, { req }) => {
        if (value === undefined) {
            throw new Error('Confirm password is required');
          }
        if (value !== req.body.Password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
]

const loginValidation = [
     body('Email').isEmail().withMessage('Please enter a valid email'),
     body('Password', 'Password must be 4 or more characters').isLength({ min: 4 })
]

module.exports = {signUpValidation, loginValidation, validationResult}