const db = require('../Config/db');
const getPosts = async ({ page, limit }) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  const [posts] = await db.execute(
    'SELECT * FROM posts WHERE IsDeleted = 0 ORDER BY CreatedAt DESC LIMIT ' + limitNum + ' OFFSET ' + offset
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

const searchPostsRepo = async (keyword, limit, offset) => {
    const searchKeyword = `%${keyword}%`;

    const sql = `
        SELECT * FROM posts 
        WHERE (Title LIKE ? OR Content LIKE ?) 
        AND IsDeleted = 0
        ORDER BY CreatedAt DESC
        LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
    
    const [rows] = await db.execute(sql, [searchKeyword, searchKeyword]);
    return rows;
};

const createPost = async ({ title_en, title_hi, title_te, content_en, content_hi, content_te, category_id, AuthorId, ImageUrl }) => {
  try {
    const query = `
      INSERT INTO posts (Title_en, Title_hi, Title_te, Content_en, Content_hi, Content_te, CategoryId, AuthorId, ImageUrl) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
   const [result] = await db.execute(query, [title_en, title_hi, title_te, content_en, content_hi, content_te, category_id, AuthorId, ImageUrl || null]);

    const [post] = await db.execute(
      'SELECT * FROM posts WHERE PostId = ?', 
      [result.insertId]
    );

    return post[0];

  } catch (error) {

        console.log("POST ERROR =>", error);

    throw new Error(error.message);
  }7
};

const getSinglePost = async (id) => {

    const query =
    `SELECT * FROM posts
     WHERE PostId = ?`;

    const [rows] =
    await db.execute(query, [id]);

    return rows[0];
};

module.exports = { createPost ,getPosts,searchPostsRepo,getSinglePost};