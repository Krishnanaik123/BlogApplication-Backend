const updateRepo = require('../Models/updateRepo');

const updatePost = async ({PostId,title,content,category_id,AuthorId,ImageUrl})=>{
    const put = await updateRepo.updatePost({PostId,title,content,category_id,AuthorId,ImageUrl: ImageUrl || null});
    return put;
}

module.exports = {updatePost};