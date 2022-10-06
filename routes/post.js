const express = require('express');
const {createPost, userPosts, updateUserPost, deleteUserPost} = require('../controllers/postcontroller');
const {createComment, getComments} = require('../controllers/commentcontroller');
const router = express.Router();
const {PostValidation, CommentValidation} = require('../validations/validations')
const {AuthenticationHandler} = require('../middleware/AuthenticationHandler');

router.post('/create-post', PostValidation,AuthenticationHandler, createPost);
router.get('/user/posts', userPosts);
router.put('/user/post/:id', PostValidation, AuthenticationHandler, updateUserPost);
router.delete('/user/post/:id', AuthenticationHandler, deleteUserPost);

router.post('/post/comment', CommentValidation, AuthenticationHandler, createComment);
router.get('/post/:id/comments', getComments);

module.exports = router;