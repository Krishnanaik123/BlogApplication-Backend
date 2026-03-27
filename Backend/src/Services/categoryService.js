const categoryRepo = require('../Models/categoryRepo.js');

const getCategories = async () => {
  const categories = await categoryRepo.getCategories();
  return categories;
};

module.exports = { getCategories };