const postService = require('../Services/postService');

const getPosts = async(req,res) => {
    try{
        console.log("Request: ", req)
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
        
        const{title,content,category_id,AuthorId,authorId} = req.body;
        const finalAuthorId = AuthorId || authorId;
  
        const missingFields = [];
        if(!title) missingFields.push('title');
        if(!content) missingFields.push('content');
        if(!category_id) missingFields.push('category_id');
        if(!finalAuthorId) missingFields.push('AuthorId/authorId');

        if(missingFields.length > 0){
            return res.status(400).json({
                success:false,
                message:`Missing required fields: ${missingFields.join(', ')}`
            })
        }

        const imageUrl = req.files && req.files.length > 0 ? req.files[0].filename : null;

        const post = await postService.createPost({title,content,category_id,AuthorId:finalAuthorId,imageUrl});

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
