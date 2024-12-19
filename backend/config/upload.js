const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { dbURI } = require('./db'); // Import database URI

let storage;

async function getUpload() {
  if (!storage) {
    // Initialize storage only once
    storage = new GridFsStorage({
      url: dbURI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      file: (req, file) => {
        const fileInfo = {
          filename: `${Date.now()}-${file.originalname}`,
          bucketName: 'uploads', // GridFS bucket name
        };
        console.log('Uploading File Info:', fileInfo);
        return fileInfo;
      },
    });

    // Listen for connection and errors
    storage.on('connection', () => {
      console.log('GridFS storage connection successful');
    });

    storage.on('error', (err) => {
      console.error('GridFS storage error:', err);
    });
  }

  // Return a multer upload instance
  return multer({ storage });
}

module.exports = { getUpload };
