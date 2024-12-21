const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const File = require('../models/FileModel');
const { getBucket } = require('../config/db');

// Upload File
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileData = {
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
    uploadDate: new Date(),
    metadata: req.body.metadata || {},
  };

  const file = new File(fileData);
  file
    .save()
    .then(() =>
      res
        .status(201)
        .json({ file: fileData, message: 'File uploaded successfully' })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ message: 'Error saving file metadata', error: err.message })
    );
};

// Get All Files
exports.getAllFiles = async (req, res) => {
  const bucket = getBucket();
  if (!bucket) {
    return res.status(500).json({ message: 'GridFSBucket is not initialized' });
  }
  try {
    const files = await bucket.find().toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No files found' });
    }
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get File by Filename
exports.getFile = async (req, res) => {
  const bucket = getBucket();
  if (!bucket) {
    return res.status(500).json({ message: 'GridFSBucket is not initialized' });
  }
  try {
    const file = await bucket.find({ filename: req.params.filename }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const readStream = bucket.openDownloadStreamByName(req.params.filename);
    res.set('Content-Type', file[0].contentType);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete File by ID
exports.deleteFile = async (req, res) => {
  const bucket = getBucket();
  if (!bucket) {
    return res.status(500).json({ message: 'GridFSBucket is not initialized' });
  }
  try {
    await bucket.delete(new ObjectId(req.params.id));
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Serve an Image by Filename
exports.getImage = async (req, res) => {
  const bucket = getBucket();
  if (!bucket) {
    return res.status(500).json({ message: 'GridFSBucket is not initialized' });
  }
  try {
    const file = await bucket.find({ filename: req.params.filename }).toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (!file[0].contentType.startsWith('image/')) {
      return res.status(400).json({ message: 'File is not an image' });
    }

    const readStream = bucket.openDownloadStreamByName(req.params.filename);
    res.set('Content-Type', file[0].contentType);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve image', error });
  }
};
