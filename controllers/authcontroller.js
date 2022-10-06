const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt    = require('jsonwebtoken');
const config = require('../config/jwt');
const saltRounds = 10;

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
      const validPassword = await bcrypt.compare(body.Password, user.Password);

      if (validPassword) {
        const payload = {
            id:  user._id
        };

        const token = jwt.sign(payload, config.secret, {
            expiresIn: 1440 // expires in 24 hours
        });

        req.session.token = token;
        res.status(200).json({
          data : {
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            Token: token
          }
        });
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
});

const logout = asyncHandler(async (req, res) => {
  req.session.destroy();

  res.status(200).json({
    success: true,
    message: "You have been Logged Out"
  });
});

module.exports = {
    signup,
    login,
    logout
}