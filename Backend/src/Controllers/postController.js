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

const getSearchPosts = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        
        const p = parseInt(page);
        const l = parseInt(limit);
        const offset = (p - 1) * l;

        // Results techuko
        const results = await postService.searchPostsService(q, l, offset);

        res.status(200).json({
            success: true,
            message: results.length > 0 ? "Search results found" : "No results match your search",
            data: results, // Ikkada results vastayi
            count: results.length // Enni matches dhorikayo count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

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

const getSinglePost = async (req, res) => {

    try {

        const { id } = req.params;

        const post =
        await postService.getSinglePost(id);

        if (!post) {

            return res.status(404).json({
                success: false,
                message: 'Post Not Found'
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {createPost,getPosts,getSearchPosts,getSinglePost};
