const express = require('express');
const {createPost, userPosts} = require('../controllers/postcontroller');
const {createComment, getComments} = require('../controllers/commentcontroller');
const router = express.Router();
const {PostValidation, CommentValidation} = require('../validations/validations')
const {AuthenticationHandler} = require('../middleware/AuthenticationHandler');

router.post('/create-post', PostValidation,AuthenticationHandler, createPost);
router.get('/user/posts', userPosts);

router.post('/post/comment', CommentValidation, AuthenticationHandler, createComment);
router.get('/post/:id/comments', getComments);

module.exports = router;