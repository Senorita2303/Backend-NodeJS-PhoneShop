const db = require("~/models");

export const createComment = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { message, productId, parentCommentId } = data.body;
            const userId = data.user.id;
            const comment = await db.Comment.create({
                message: message,
                userId: userId,
                productId: productId,
                parentCommentId: parentCommentId
            })
            resolve({
                success: true,
                comment: comment
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllComments = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const comments = await db.Comment.findAll({
                attributes: ['id', 'message', 'createdAt', 'parentCommentId'],
                where: {
                    productId: data
                },
                include: [
                    { model: db.User, as: 'user', attributes: ['userName', 'avatarUrl'] },
                ],
                order: [['createdAt', 'DESC']],
                raw: true,
                nest: true
            })
            resolve({
                success: true,
                comments: comments
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateComment = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let commentData = {};
            commentData.errMessage = null;
            commentData.comment = {};
            commentData.success = false;
            const id = data.params.id;
            const body = data.body;
            let comment = await db.Comment.findOne({
                where: {
                    id: id,
                },
                raw: false
            });

            if (!comment) {
                commentData.errMessage = "Comment not found"
            } else {
                comment.name = body.name;
                comment.code = body.code;
                await comment.save();
                commentData.success = true;
                commentData.comment = response;
            }
            resolve(commentData);
        } catch (error) {
            reject(error);
        }
    });

export const deleteComment = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const id = data.id;
            const response = await db.Comment.destroy({
                where: {
                    id: id
                },
            });
            resolve({
                success: true,
            });
        } catch (error) {
            reject(error);
        }
    });