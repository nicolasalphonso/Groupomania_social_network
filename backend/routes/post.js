const express = require('express');
// import of Router
const router = express.Router();

// import of authentication middleware
const auth = require('../middleware/auth');
// import of file management middleware
const multer = require('../middleware/multer-config');

// all controls are in the controler post file
const postCtrl = require('../controlers/post');

// all request are authentified (auth)
// route to get all posts
router.get('/', auth, postCtrl.getAllPosts);
//route to create a post
//router.post('/', auth, multer, postCtrl.createPost);
router.post('/', postCtrl.createPost);
// route to modify a post
router.put('/:id', auth, multer, postCtrl.modifyPost);
// route to delete a post
router.delete('/:id', auth, postCtrl.deletePost);
// route to manage likes
router.post('/:id/like', auth, postCtrl.likesManagement);

// export of router
module.exports = router;