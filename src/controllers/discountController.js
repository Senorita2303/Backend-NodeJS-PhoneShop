const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

// Create Discount Admin route 
export const createDiscount = async (req, res) => {
    try {
        const response = await services.createDiscount(req.body);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all discount 
export const getAllDiscounts = async (req, res) => {
    try {
        const response = await services.getAllDiscounts();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Update admin route
export const updateDiscount = async (req, res) => {
    try {
        const response = await services.updateDiscount(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Delete discount -- admin
export const deleteDiscount = async (req, res) => {
    try {
        const response = await services.deleteDiscount(req.params);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Detils of discount
export const getDiscountDetails = async (req, res) => {
    try {
        const response = await services.getDiscountDetails(req.params.id);
        return res.status(StatusCodes.OK).json(response);

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};