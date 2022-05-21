const Alert = require('../schemas/alert')


const deleteComment = async (req, res) => {
    const { commentId } = req.params

    try {
        const existComment = await Comment.findOne({ _id: commentId })
        if (existComment) {
            await Comment.deleteOne({ _id: commentId })
            res.status(200).json({
                result: true,
                msg: "댓글이 삭제되었어요.",
            })
        }
    } catch (error) {
        console.log("댓글 삭제 오류", error)
        res.status(400).send({
            result: false,
            msg: "댓글 삭제 실패",
        })
    }
}











module.exports = {}
