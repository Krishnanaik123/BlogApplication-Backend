const postService = require('../Services/postService');
const { translateText,} = require('../Services/translationService');
const getPosts = async(req,res) => {
    try{
        const {page=1,limit=10,categoryId} = req.query;
        const posts = await postService.getPosts({page,limit,categoryId});
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
        const { q, keyword,page = 1, limit = 10 } = req.query;

          const searchTerm = q || keyword;
        
        const p = parseInt(page);
        const l = parseInt(limit);
        const offset = (p - 1) * l;

         const [results, total] = await Promise.all([
            postService.searchPostsService(searchTerm, l, offset),
            postService.searchPostsCount(searchTerm)
        ]);

        // const results = await postService.searchPostsService(searchTerm, l, offset);
        res.status(200).json({
            success: true,
            message: results.length > 0 ? "Search results found" : "No results match your search",
            data: results, 
            count: results.length ,
            pagination: {
                total,
                page: p,
                limit: l,
                totalPages: Math.ceil(total / l)  
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const createPost = async (req, res) => {
    try {
        const { title_en, content_en, category_id, AuthorId, authorId } = req.body;
        const finalAuthorId = AuthorId || authorId;

      
        if (!title_en) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: title_en'
            })
        }

        //  Step 2 — Then translate:
        const [title_hi, title_te, content_hi, content_te] = await Promise.all([
            translateText(title_en, "hi"),
            translateText(title_en, "te"),
            translateText(content_en, "hi"),
            translateText(content_en, "te")
        ]);

       
        const imageUrl = req.files && req.files.length > 0 
            ? req.files[0].path 
            : null;

       
        const post = await postService.createPost({
            title_en, title_hi, title_te,
            content_en, content_hi, content_te,
            category_id, AuthorId: finalAuthorId, imageUrl
        });

        res.status(201).json({
            success: true,
            message: "Created Post Successfully",
            data: post
        })

    } catch (error) {
       console.log("CREATE POST ERROR =>", JSON.stringify(error, null, 2));
    console.log("CREATE POST MESSAGE =>", error?.message);
    console.log("CREATE POST STRING =>", String(error));
        res.status(500).json({
            success: false,
            message: 'Failed to Create Post',
            error: error.message
        })
    }
};

const getSinglePost = async (req, res) => {

    try {

        const { id } = req.params;
        const post = await postService.getSinglePost(id);

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
