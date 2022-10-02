const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator');
const Comment = require('../models/comment');
const jwt    = require('jsonwebtoken');
const config = require('../config/jwt');
const mongoose = require('mongoose');


// @desc Create  new post
// @route GET /api/v1/createPost
// @access Private
const createComment = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const body = {...req.body}
    const token = req.headers.authorization || '';

    
    var decoded = jwt.decode(token, config.secret);
    
    body.Author = mongoose.Types.ObjectId(decoded.id);

    if(!body.Author.id) {
        return res.status(401).json({ code : 401, message: 'Unauthorized' });
    }
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   

     const comment = await Comment.create(body);

     res.status(201).json(comment)
});


// @desc Get  user posts
// @route GET /api/v1/posts
// @access Private
const getComments = asyncHandler(async (req, res, next) => {

    const postId = req.params.id;
    
   
   let page;

   if(req.query.page){
       page = parseInt(req.query.page);
   }
   else{
       page = 1;
   }
   const limit = 2;
   const skip = (page - 1) * limit;
  
    const comments = await Comment.find({PostId: postId}).skip(skip).limit(limit)
    
    const total = (comments.length) ? await Comment.countDocuments({}) : null;
    return res.status(200).json({
        data:comments,
        meta: {
            total:total,
            currentPage:page,
            nextPage:(comments.length) ? page + 1 : null,
            previousPage:(comments.length && page != 1) ? page - 1 : null
        }
    });

   
});

module.exports = {
    createComment,
    getComments
}