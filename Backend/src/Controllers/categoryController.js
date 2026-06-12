const categoryService = require('../Services/categoryService.js');
const getCategories = async (req, res) => {
  try {
    
    const { categoryId } = req.query;
    const categories = await categoryService.getCategories(categoryId);
    res.status(200).json({
      success: true,
      data:categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

module.exports = { getCategories };