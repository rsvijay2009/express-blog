const express = require('express');
const {signup, login, logout} = require('../controllers/authcontroller');
const router = express.Router();
const {signUpValidation, loginValidation} = require('../validations/validations')

router.post('/signup', signUpValidation, signup);
router.post('/login',loginValidation, login);
router.post('/logout', logout);

module.exports = router;