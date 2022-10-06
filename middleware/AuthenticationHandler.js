const express = require('express');
const jwt    = require('jsonwebtoken');
const config = require('../config/jwt');

const  AuthenticationHandler = express.Router(); 

AuthenticationHandler.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, config.secret, (err, decoded) =>{      
        if (err) {
          return res.status(401).json({ code : 401, message: 'Unauthorized' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
        return res.status(401).json({ code : 401, message: 'Unauthorized' });
    }
  });

module.exports = {
  AuthenticationHandler
}