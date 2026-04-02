const postService = require('../Services/postService');

const getPosts = async(req,res) => {
    try{
        const {page=1,limit=10} = req.query;
        const posts = await postService.getPosts({page,limit});
        res.status(200).json({
            success:true,
            message:"Fetched Posts Successfully",
            data:posts.data,
            pagination:posts.pagination
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Failed to fetch Posts',
            error:error.message
        })
    }
}


const createPost = async(req,res) => {
    try{
        const{title,content,category_id,AuthorId, ImageUrl} = req.body;

        if(!title || !content || !category_id || !AuthorId){
            return res.status(400).json({
                success:false,
                message:"title,content,category_id and AuthorId are must required"
            })
        }

const post = await postService.createPost({title,content,category_id,AuthorId,ImageUrl});

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

module.exports = {createPost,getPosts};
