const express = require('express');
const {signup, login} = require('../controllers/authcontroller');
const router = express.Router();
const {signUpValidation, loginValidation} = require('../validations/validations')

router.post('/signup', signUpValidation, signup);
router.post('/login',loginValidation, login);

module.exports = router;