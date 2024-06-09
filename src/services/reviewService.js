const db = require("~/models");

export const createReview = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { content, star, productId, userId } = data;
            const review = await db.Review.create({
                message: content,
                rating: star,
                userId: userId,
                productId: productId,
            })
            resolve({
                success: true,
                review: review
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllReviews = (data) =>
    new Promise(async (resolve, reject) => {
        try {

            const reviews = await db.Review.findAll({
                where: {
                    productId: data
                }
            })
            console.log(reviews);
            resolve({
                success: true,
                reviews: reviews
            });
        } catch (error) {
            reject(error);
        }
    });
