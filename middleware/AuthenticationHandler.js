const express = require('express');
const jwt    = require('jsonwebtoken');
const config = require('../config/jwt');

const  AuthenticationHandler = express.Router(); 

AuthenticationHandler.use((req, res, next) =>{
    // check header for the token
    var token = req.headers.authorization;
    

    // decode token
    if (token) {
      // verifies secret and checks if the token is expired
      jwt.verify(token, config.secret, (err, decoded) =>{      
        if (err) {
          return res.status(401).json({ code : 401, message: 'Unauthorized' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
      });

    } else {

      // if there is no token  

     

         return res.status(401).json({ code : 401, message: 'Unauthorized' });    
     

    }
  });

  module.exports = {
    AuthenticationHandler
  }