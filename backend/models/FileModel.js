const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, required: true },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
