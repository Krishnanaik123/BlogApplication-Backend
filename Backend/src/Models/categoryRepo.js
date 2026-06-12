const db = require('../Config/db');

const getCategories = async (categoryId) => {
  let query = 'SELECT CategoryId, CategoryName FROM categories ORDER BY CategoryName';
  let params = [];

  if (categoryId) {
    query = 'SELECT CategoryId, CategoryName FROM categories WHERE CategoryId = ? ORDER BY CategoryName';
    params = [Number(categoryId)];
  }

  const [categories] = await db.execute(query, params);
  return categories;
};

module.exports = { getCategories };