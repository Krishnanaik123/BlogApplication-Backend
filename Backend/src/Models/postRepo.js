const db = require('../Config/db');

const createPost = async ({ title, content, category_id, author_id, image_url }) => {
  try {
    const query = `
      INSERT INTO posts (Title, Content, CategoryId, author_id, Image_url) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
   const [result] = await db.execute(query, [title, content, category_id, author_id, image_url || null]);

    const [post] = await db.execute(
      'SELECT * FROM posts WHERE PostId = ?', 
      [result.insertId]
    );

    return post[0];

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createPost };