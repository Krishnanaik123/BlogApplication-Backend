const postService = require('../Services/postService');

const createPost = async(req,res) => {
    try{
        const{title,content,category_id,author_id, image_url} = req.body;

        //Validation require Input Part
        if(!title || !content || !category_id || !author_id){
            return res.status(400).json({
                success:false,
                message:"title,content,category_id and author_id are must required"
            })
        }

const post = await postService.createPost({title,content,category_id,author_id,image_url});

res.status(201).json({
    success:true,
    message:"Created Post Successfully",
    data:post
})
}catch(error){
    res.status(500).json({
        success:false,
        message:'Failed to Create Post',
        error:error.message
    })
}

};

module.exports = {createPost};
