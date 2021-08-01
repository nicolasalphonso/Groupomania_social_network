const express = require('express');
// import of Router
const router = express.Router();

// import of authentication middleware
const auth = require('../middleware/auth');

// all controls are in the controler post file
const postCtrl = require('../controlers/comment');

// all request are authentified (auth)
// route to get all comments
router.get('/:id', auth, postCtrl.getComments);
//route to create a comment
router.post('/', auth, postCtrl.createComment);
// route to modify a comment
router.put('/:id', auth, postCtrl.modifyComment);
// route to delete a comment
router.delete('/:id', auth, postCtrl.deleteComment);

// export of router
module.exports = router;