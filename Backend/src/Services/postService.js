const postRepo = require('../Models/postRepo');

const createPost = async ({title,content,category_id,AuthorId,imageUrl})=>{
    const post = await postRepo.createPost({title,content,category_id,AuthorId,ImageUrl: imageUrl || null});
    return post;
}

const getPosts = async ({page,limit}) => {
    const posts = await postRepo.getPosts({page,limit});
    return posts;
}

const getPostById = async (postId) => {
    const post = await postRepo.getPostById(postId);
    return post;
}

module.exports = {createPost,getPosts,getPostById};