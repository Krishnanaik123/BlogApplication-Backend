const db = require('../Config/db');

const deletePost = async (PostId) => {
    try {
        const query = 'UPDATE posts SET IsDeleted = 1 WHERE PostId = ?';
        const [result] = await db.execute(query, [PostId]);

        if (result.affectedRows === 0) {
            return {
                success: false,
                message: "Post not found"
            };
        }

        return {
            success: true,
            message: "Post deleted successfully"
        };
    } catch (error) {
        throw error;
    }
};

module.exports = { deletePost };