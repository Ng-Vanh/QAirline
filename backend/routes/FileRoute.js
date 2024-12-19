const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FileController = require('../controllers/FileController');
const { getUpload } = require('../config/upload'); // Import upload configuration
const { getBucket } = require('../config/db'); // Import GridFS bucket

const router = express.Router();

// Upload File (Dynamic based on configuration)
router.post('/upload', async (req, res) => {
  try {
    const uploadInstance = await getUpload(); // Dynamically get the upload instance
    const multerMiddleware = uploadInstance.single('image');

    multerMiddleware(req, res, (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload failed', error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      console.log('Uploaded File:', req.file);
      res.status(201).json({
        message: 'File uploaded successfully',
        file: req.file,
      });
    });
  } catch (err) {
    console.error('Error initializing upload:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// List All Files
router.get('/', async (req, res) => {
  try {
    const files = await FileController.getAllFiles();
    res.status(200).json(files);
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ message: 'Failed to fetch files', error: err.message });
  }
});

// Get File by Filename
router.get('/:filename', async (req, res) => {
  try {
    const file = await FileController.getFile(req.params.filename);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json(file);
  } catch (err) {
    console.error('Error fetching file:', err);
    res.status(500).json({ message: 'Failed to fetch file', error: err.message });
  }
});

// Delete File by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await FileController.deleteFile(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ message: 'Failed to delete file', error: err.message });
  }
});

// Serve Image by Filename
router.get('/image/:filename', async (req, res) => {
  try {
    const bucket = getBucket();

    if (bucket) {
      // GridFS handling
      const file = await bucket.find({ filename: req.params.filename }).toArray();

      if (!file || file.length === 0) {
        return res.status(404).json({ message: 'File not found' });
      }

      const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
      res.set('Content-Type', file[0].contentType || 'application/octet-stream');
      return downloadStream.pipe(res);
    } else {
      // Local filesystem handling
      const filePath = path.join(__dirname, '../uploads', req.params.filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found' });
      }

      res.set('Content-Type', 'application/octet-stream');
      return fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).json({ message: 'Failed to serve image', error: err.message });
  }
});

module.exports = router;
