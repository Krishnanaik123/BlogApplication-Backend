const db = require('../Config/db');

const getCategories = async () => {
  const [categories] = await db.execute(
    'SELECT CategoryId, CategoryName FROM categories ORDER BY CategoryName'
  );
  return categories;
};

module.exports = { getCategories };