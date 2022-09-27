const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const saltRounds = 10;

// @desc Create  new user
// @route GET /api/v1/signup
// @access Private
const signup = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const body = {...req.body}

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    body.Password = bcrypt.hashSync(body.Password, saltRounds);
    const user = await User.create(body);

    res.status(201).json(user)
});

const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const body = req.body;
    const user = await User.findOne({ Email: body.Email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.Password, user.Password);
      if (validPassword) {
        res.status(200).json(user);
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
   
    

    
});

module.exports = {
    signup,
    login
}