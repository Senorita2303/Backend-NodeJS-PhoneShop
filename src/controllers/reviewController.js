const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

// Create review
export const createReview = async (req, res) => {
    try {
        const response = await services.createReview(req.body);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const response = await services.getAllReviews(req.params.id);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};
