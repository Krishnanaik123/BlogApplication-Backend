const db = require('../Config/db');

const getPosts = async ({ page, limit, categoryId, authorId }) => {

  console.time('GetPosts-Timer');

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

  const fullColumns = `
    PostId, Title, Content,
    Title_En, Title_Hi, Title_Te,
    Content_En, Content_Hi, Content_Te,
    CategoryId, AuthorId, ImageUrl, CreatedAt, IsDeleted
  `;

  let query;
  let queryParams = [];

  if (!categoryId && !authorId) {
    query = `
      SELECT ${fullColumns}
      FROM posts USE INDEX (idx_created_at)
      WHERE IsDeleted = 0
    `;
  }

  else if (categoryId && !authorId) {
    query = `
      SELECT ${fullColumns}
      FROM posts USE INDEX (idx_category_created_at)
      WHERE IsDeleted = 0 AND CategoryId = ?
    `;
    queryParams.push(Number(categoryId));
  }

  else if (authorId && !categoryId) {
    query = `
      SELECT ${fullColumns}
      FROM posts USE INDEX (idx_author_id)
      WHERE IsDeleted = 0 AND AuthorId = ?
    `;
    queryParams.push(Number(authorId));
  }

  else {
    query = `
      SELECT ${fullColumns}
      FROM posts USE INDEX (idx_category_created_at)
      WHERE IsDeleted = 0 AND CategoryId = ? AND AuthorId = ?
    `;
    queryParams.push(Number(categoryId), Number(authorId));
  }

  query += ` ORDER BY CreatedAt DESC LIMIT ${limitNum} OFFSET ${offset}`;

  const [posts] = await db.execute(query, queryParams);
  console.timeEnd('GetPosts-Timer');

  let countQuery;
  let countParams = [];

  if (!categoryId && !authorId) {
    countQuery = `
      SELECT COUNT(*) as total
      FROM posts USE INDEX (idx_isdeleted)
      WHERE IsDeleted = 0
    `;
  }

  else if (categoryId && !authorId) {
    countQuery = `
      SELECT COUNT(*) as total
      FROM posts USE INDEX (idx_isdeleted_cat_author)
      WHERE IsDeleted = 0 AND CategoryId = ?
    `;
    countParams.push(Number(categoryId));
  }

  else if (authorId && !categoryId) {
    countQuery = `
      SELECT COUNT(*) as total
      FROM posts USE INDEX (idx_isdeleted_cat_author)
      WHERE IsDeleted = 0 AND AuthorId = ?
    `;
    countParams.push(Number(authorId));
  }

  else {
    countQuery = `
      SELECT COUNT(*) as total
      FROM posts USE INDEX (idx_isdeleted_cat_author)
      WHERE IsDeleted = 0 AND CategoryId = ? AND AuthorId = ?
    `;
    countParams.push(Number(categoryId), Number(authorId));
  }

  const [[{ total }]] = await db.execute(countQuery, countParams);

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


const searchPostsRepo = async (searchTerm, limit, offset) => {

    const wildcardTerm = searchTerm
    .trim()
    .split(/\s+/)
    .map(word => `${word}*`)
    .join(' ');

  const sql = `
    SELECT PostId, Title, Content,
      Title_En, Title_Hi, Title_Te,
      Content_En, Content_Hi, Content_Te,
      CategoryId, AuthorId, ImageUrl, CreatedAt, IsDeleted
    FROM posts USE INDEX (idx_posts_fulltext_search)
    WHERE
      MATCH(Title_En, Content_En, Title, Content) AGAINST (? IN BOOLEAN MODE)
      AND IsDeleted = 0
    ORDER BY CreatedAt DESC
    LIMIT ${Number(limit)}
    OFFSET ${Number(offset)}
  `;

  const [rows] = await db.execute(sql, [wildcardTerm]);
  return rows;
};


const createPost = async ({
  title_en, title_hi, title_te,
  content_en, content_hi, content_te,
  category_id, AuthorId, ImageUrl
}) => {
  try {
    const query = `
      INSERT INTO posts
      (
        Title_En, Title_Hi, Title_Te,
        Content_En, Content_Hi, Content_Te,
        CategoryId, AuthorId, ImageUrl
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      title_en, title_hi, title_te,
      content_en, content_hi, content_te,
      category_id, AuthorId, ImageUrl || null
    ]);

    const [post] = await db.execute(`
      SELECT PostId,
        Title, Content,
        Title_En, Title_Hi, Title_Te,
        Content_En, Content_Hi, Content_Te,
        CategoryId, AuthorId, ImageUrl,
        CreatedAt, IsDeleted
      FROM posts WHERE PostId = ?
    `, [result.insertId]);

    return post[0];
  } catch (error) {
    console.log("POST ERROR =>", error);
    throw new Error(error.message);
  }
};


const getSinglePost = async (id) => {
  const query = `
    SELECT PostId,
      Title, Content,
      Title_En, Title_Hi, Title_Te,
      Content_En, Content_Hi, Content_Te,
      CategoryId, AuthorId, ImageUrl,
      CreatedAt, IsDeleted
    FROM posts
    WHERE PostId = ?
  `;

  const [rows] = await db.execute(query, [id]);
  return rows[0];
};

const searchPostsCount = async (searchTerm) => {

 const wildcardTerm = searchTerm
    .trim()
    .split(/\s+/)
    .map(word => `${word}*`)
    .join(' ');

    const sql = `
        SELECT COUNT(*) as total
        FROM posts
        USE INDEX (idx_posts_fulltext_search)
        WHERE
            MATCH(Title_En, Content_En, Title, Content) 
            AGAINST (? IN BOOLEAN MODE)
            AND IsDeleted = 0
    `;
    const [[{ total }]] = await db.execute(sql, [wildcardTerm]);
    return total;
};

module.exports = { createPost, getPosts, searchPostsRepo, searchPostsCount, getSinglePost };

