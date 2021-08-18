const jwt = require("jsonwebtoken"); // import of JSON web token

/** function isAllowed checks user id and admin state from token
 * 
 * @param {*} req : request
 * @returns an object with eh user id and te admin state from the token
 */
function isAllowed(req) {
    // token is the second element of header authorization
  const token = req.headers.authorization.split(' ')[1];
  // token decoding
  const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
  // retrieving userId from decoded token
  const userIdFromToken = decodedToken.userId;
  
  // retrieving isAdmin from decoded token
  const isAdminFromToken = decodedToken.isAdmin;
  
  return {userIdFromToken , isAdminFromToken};
  }

  exports.isAllowed = isAllowed;