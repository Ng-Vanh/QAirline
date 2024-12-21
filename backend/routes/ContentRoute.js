const express = require('express');
const ContentController = require('../controllers/ContentController');

const router = express.Router();

// Route to get all content
router.get('/', ContentController.getAllContent);

// Route to create new content
router.post('/', ContentController.createContent);

// Route to update content by ID
router.put('/:id', ContentController.updateContent);

// Route to get content by ID
router.get('/:id', ContentController.getContentById);

// Route to delete content by ID
router.delete('/:id', ContentController.deleteContent);

module.exports = router;
