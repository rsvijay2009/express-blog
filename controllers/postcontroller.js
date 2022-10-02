const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator');
const Post = require('../models/post');
const jwt    = require('jsonwebtoken');
const config = require('../config/jwt');
const mongoose = require('mongoose');


// @desc Create  new post
// @route GET /api/v1/createPost
// @access Private
const createPost = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const body = {...req.body};
    const token = req.headers.authorization;
    const decoded = jwt.decode(token, config.secret);
    body.Author = mongoose.Types.ObjectId(decoded.id);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const post = await Post.create(body);

    res.status(201).json(post)
});

// @desc Get  user posts
// @route GET /api/v1/posts
// @access Private
const userPosts = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization;;
   
    if (token) {
        // verifies secret and checks if the token is expired
        jwt.verify(token, config.secret, async (err, decoded) => {
            const userId = decoded.id;

            if (err) {
                return res.status(401).json({ code : 401, message: 'Unauthorized' });    
            } else {
                let page = (req.query.page) ? parseInt(req.query.page) : 1;
                const limit = 5;
                const skip = (page - 1) * limit;
                const total = await Post.countDocuments({Author: userId});
                const posts = await Post.find({Author: userId}).skip(skip).limit(limit)
                    
                return res.status(200).json({
                    data:posts,
                    meta: {
                        total:total,
                        currentPage:page,
                        nextPage:(posts.length && (page * limit < total)) ? page + 1 : null,
                        previousPage:(posts.length && page != 1) ? page - 1 : null
                    }
                });
            }
        });
  
    } else {
           return res.status(401).json({ code : 401, message: 'Unauthorized' });   
    }
});

module.exports = {
    createPost,
    userPosts
}