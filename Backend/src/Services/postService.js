const postRepo = require('../Models/postRepo');

const createPost = async ({title,content,category_id,AuthorId,imageUrl})=>{
    const post = await postRepo.createPost({title,content,category_id,AuthorId,ImageUrl: imageUrl || null});
    return post;
}

const getPosts = async ({page,limit}) => {
    const posts = await postRepo.getPosts({page,limit});
    return posts;
}


const searchPostsService = async (q, limit, offset) => {
    // ikkada Repository function pilustunnam
    return await postRepo.searchPostsRepo(q, limit, offset);
};

const getSinglePost = async (id) => {

    return await postRepo
    .getSinglePost(id);
};
module.exports = {createPost,getPosts,searchPostsService,getSinglePost};