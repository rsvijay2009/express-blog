const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator');
const Comment = require('../models/comment');
const jwt    = require('jsonwebtoken');
const config = require('../config/jwt');
const mongoose = require('mongoose');


const createComment = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const body = {...req.body}
    const token = req.headers.authorization || '';
    const decoded = jwt.decode(token, config.secret);
    
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

const getComments = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    let page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({PostId: postId}).sort({'createdAt': -1}).skip(skip).limit(limit)
    const total = (comments.length) ? await Comment.countDocuments({PostId: postId}) : null;
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