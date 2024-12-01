const express = require('express');
const router = express.Router();
const ContentController = require('../controllers/ContentController');

// Route to get all content
router.get('/', ContentController.getAllContent);

// Route to get content by Id
router.get('/:id', ContentController.getContentById);

// Route to create new content
router.post('/', ContentController.createContent);

// Route to update content
router.put('/:id', ContentController.updateContent);

// Route to delete content
router.delete('/:id', ContentController.deleteContent);

module.exports = router;
