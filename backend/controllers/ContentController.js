const Content = require('../models/ContentModel.js');

// Get all content
exports.getAllContent = async (req, res) => {
  try {
    const content = await Content.find({ isActive: true });
    return res.status(200).json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create new content
exports.createContent = async (req, res) => {
  try {
    const { title, description, image, isActive, contentType } = req.body;

    // Validate required fields
    if (!title || !description || !contentType) {
      return res.status(400).json({ message: 'Title, description, and contentType are required.' });
    }

    // Validate image field (expecting filename from previous upload)
    if (!image) {
      return res.status(400).json({ message: 'Image filename is required.' });
    }

    const newContent = {
      title,
      description,
      image, // Use the filename provided in the request body
      isActive: isActive !== undefined ? isActive : true,
      contentType,
    };

    const savedContent = await Content.create(newContent);
    res.status(201).json({ message: 'Content created successfully', savedContent });
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ message: 'Failed to create content', error: err.message });
  }
};

// Update existing content
exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, description, contentType, isActive } = req.body;

    const updatedContent = await Content.findByIdAndUpdate(
      id,
      { title, image, description, contentType, isActive, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    return res.status(200).json({ message: 'Content updated successfully', updatedContent });
  } catch (error) {
    console.error('Error updating content:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get content by ID
exports.getContentById = async (req, res) => {
  try {
    const id = req.params.id;
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    return res.status(200).json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete content
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContent = await Content.findByIdAndDelete(id);

    if (!deletedContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    return res.status(200).json({ message: 'Content deleted successfully', deletedContent });
  } catch (error) {
    console.error('Error deleting content:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
