const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { dbURI } = require('./db');

let storage;

async function getUpload() {
  if (!storage) {
    storage = new GridFsStorage({
      url: dbURI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      file: (req, file) => {
        const fileInfo = {
          filename: `${Date.now()}-${file.originalname}`,
          bucketName: 'uploads',
        };
        console.log('Uploading File Info:', fileInfo);
        return fileInfo;
      },
    });

    storage.on('connection', () => {
      console.log('GridFS storage connection successful');
    });

    storage.on('error', (err) => {
      console.error('GridFS storage error:', err);
    });
  }

  return multer({ storage });
}

module.exports = { getUpload };
