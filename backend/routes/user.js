const express = require('express');
// required router (optimisation of backend files)
const router = express.Router();
// controler to associate the functions to the different routes
const userCtrl = require('../controlers/user');

// import of file management middleware
const multer = require('../middleware/multer-config');

// import of express-bouncer - brute force
const bouncer = require("express-bouncer")(30000, 90000, 3);

// import of authentication middleware
const auth = require('../middleware/auth');

//routes to controllers
router.post('/signup', bouncer.block, userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);
router.get("/profile/:id", auth, userCtrl.getUserProfile);
router.put("/profile/:id/photo", auth, multer, userCtrl.updateUserPhotoProfile);
router.put("/profile/:id/infos", auth, userCtrl.updateUserInfoProfile);
router.delete("/profile/:id", auth, userCtrl.deleteUserProfile);

// Clear all logged addresses
// (Usually never really used)
bouncer.addresses = { };

// export of routers
module.exports = router;