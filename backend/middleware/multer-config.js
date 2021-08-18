// import of multer for file management
const multer = require('multer');
const upload = multer();

// Mime types of received files
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// configuration of multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // null = pas d'erreur
  },
  filename: (req, file, callback) => {
    // retrieving and comuting original name
    const name = file.originalname.split(' ').join('_').replace(".","");
    // create extension according to the mimetypes
    const extension = MIME_TYPES[file.mimetype];
    // creating filename adding a timestamp
    callback(null, name + Date.now() + '.' + extension);
  }
});


// export of multer middleware setted
module.exports = multer({storage: storage}).single('attachment');