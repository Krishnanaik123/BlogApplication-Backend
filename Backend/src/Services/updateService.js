const updateRepo = require('../Models/updateRepo');

const updatePost = async ({PostId,title,content,category_id,AuthorId,imageUrl})=>{
    const put = await updateRepo.updatePost({PostId,title,content,category_id,AuthorId,ImageUrl: imageUrl || null});
    return put;
}

module.exports = {updatePost};