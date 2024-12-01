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
    const { title, image, description, contentType } = req.body;

    const newContent = new Content({ title, image, description, contentType });
    await newContent.save();

    return res.status(201).json({ message: 'Content created successfully', newContent });
  } catch (error) {
    console.error('Error creating content:', error);
    return res.status(500).json({ message: 'Server error' });
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

// Controller for getting an aircraft by its ID
exports.getContentById = async (req, res) => {
    try {
      const id = req.params.id;
      const content = await Content.findById(id);
  
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
  
      return res.status(200).json(content);
    } catch (error) {
      console.error('Error fetching aircraft:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

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
