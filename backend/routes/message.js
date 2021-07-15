const express = require('express');
// import of Router
const router = express.Router();

// import of authentication middleware
const auth = require('../middleware/auth');
// import of file management middleware
const multer = require('../middleware/multer-config');

// all controls are in the controler message file
const messageCtrl = require('../controlers/message');

// all request are authentified (auth)
// route to get all messages
router.get('/', auth, messageCtrl.getAllMessages);
//route to create a message
router.post('/', auth, multer, messageCtrl.createMessage);
//route to get one message
// ":" before id means that this part of the route is dynamic
router.get('/:id', auth, messageCtrl.getOneMessage);
// route to modify a message
router.put('/:id', auth, multer, messageCtrl.modifyMessage);
// route to delete a message
router.delete('/:id', auth, messageCtrl.deleteMessage);
// route to manage likes
router.post('/:id/like', auth, messageCtrl.likesManagement);

// export of router
module.exports = router;