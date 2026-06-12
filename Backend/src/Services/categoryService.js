const categoryRepo = require('../Models/categoryRepo.js');
const getCategories = async (categoryId) => {
  const categories = await categoryRepo.getCategories(categoryId);
  return categories;
};

module.exports = { getCategories };