const postRepo = require('../Models/postRepo');

const createPost = async ({title,content,category_id,author_id,image_url})=>{
    const post = await postRepo.createPost({title,content,category_id,author_id,image_url: image_url || null});
    return post;
}

module.exports = {createPost};