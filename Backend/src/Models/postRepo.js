const db = require('../Config/db');
const getPosts = async ({ page, limit }) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  const [posts] = await db.execute(
    'SELECT * FROM posts WHERE IsDeleted = 0 ORDER BY CreatedAt DESC LIMIT ? OFFSET ?',
    [limitNum, offset]
  );

  const [[{ total }]] = await db.execute(
    'SELECT COUNT(*) as total FROM posts WHERE IsDeleted = 0'
  );

  return {
    data: posts,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

const getPostById = async (postId) => {
  try {
    const [post] = await db.execute(
      'SELECT * FROM posts WHERE PostId = ? AND IsDeleted = 0',
      [postId]
    );
    return post[0] || null;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createPost = async ({ title, content, category_id, AuthorId, ImageUrl }) => {
  try {
    const query = `
      INSERT INTO posts (Title, Content, CategoryId, AuthorId, ImageUrl) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
   const [result] = await db.execute(query, [title, content, category_id, AuthorId, ImageUrl || null]);

    const [post] = await db.execute(
      'SELECT * FROM posts WHERE PostId = ?', 
      [result.insertId]
    );

    return post[0];

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createPost, getPosts, getPostById };