const postRepo = require('../Models/postRepo');

const createPost = async ({title,content,category_id,AuthorId,imageUrl})=>{
    const post = await postRepo.createPost({title,content,category_id,AuthorId,ImageUrl: imageUrl || null});
    return post;
}

const getPosts = async ({page,limit}) => {
    const posts = await postRepo.getPosts({page,limit});
    return posts;
}

module.exports = {createPost,getPosts};