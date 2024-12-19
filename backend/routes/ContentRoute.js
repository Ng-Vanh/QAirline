const express = require('express');
const ContentController = require('../controllers/ContentController');

const router = express.Router();

// Routes
router.get('/', ContentController.getAllContent); // Get all content
router.post('/', ContentController.createContent); // Create new content
router.put('/:id', ContentController.updateContent); // Update existing content
router.get('/:id', ContentController.getContentById); // Get content by ID
router.delete('/:id', ContentController.deleteContent); // Delete content by ID

module.exports = router;
