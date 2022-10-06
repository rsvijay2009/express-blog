const asyncHandler = require('express-async-handler')
const { validationResult } = require('express-validator');
const Post = require('../models/post');
const jwt    = require('jsonwebtoken');
const config = require('../config/jwt');
const mongoose = require('mongoose');

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

const userPosts = asyncHandler(async (req, res, next) => {
    const token = req.session.token || null;
   
    if (token) {
        jwt.verify(token, config.secret, async (err, decoded) => {
            const userId = decoded.id;

            if (err) {
                return res.status(401).json({ code : 401, message: 'Unauthorized' });
            } else {
                let page = (req.query.page) ? parseInt(req.query.page) : 1;
                const limit = 5;
                const skip = (page - 1) * limit;
                const total = await Post.countDocuments({Author: userId});
                const posts = await Post.find({Author: userId}).sort({'createdAt': -1}).skip(skip).limit(limit)
                    
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

const updateUserPost = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const body = {...req.body};

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const postId = req.params.id;
    const token = req.headers.authorization;;

    if (token) {
        jwt.verify(token, config.secret, async (err, decoded) => {
            const userId = mongoose.Types.ObjectId(decoded.id);
            console.log(userId);
            if (err) {
                return res.status(401).json({ code : 401, message: 'Unauthorized' });
            } else {
                const post = await Post.findById(postId);
                if(post.Author.equals(userId)) {
                    const option = {new: true}
                    const post = await Post.findOneAndUpdate(postId, body, option)
                    return res.status(200).json({ code : 200, data: post });
                } else {
                    return res.status(401).json({ code : 401, message: 'Unauthorized' });
                }
            }
        });
    } else {
        return res.status(401).json({ code : 401, message: 'Unauthorized' });
    }
});

const deleteUserPost = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, config.secret, async (err, decoded) => {
            const userId = mongoose.Types.ObjectId(decoded.id);
            if (err) {
                return res.status(401).json({ code : 401, message: 'Unauthorized' });
            } else {
                const post = await Post.findById(postId);
                if(!post) {
                    return res.status(200).json({ code : 200, message: 'Post not found' });
                }
                if(post.Author.equals(userId)) {
                    await Post.findByIdAndRemove(postId);
                    return res.status(200).json({ code : 200, message: 'Post removed successfully' });
                } else {
                    return res.status(401).json({ code : 401, message: 'Unauthorized' });
                }
            }
        });
    } else {
        return res.status(401).json({ code : 401, message: 'Unauthorized' });
    }
});

module.exports = {
    createPost,
    userPosts,
    updateUserPost,
    deleteUserPost
}