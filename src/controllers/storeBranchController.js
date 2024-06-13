const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

// CreateStoreBranch Admin route 
export const createStoreBranch = async (req, res) => {
    try {
        const response = await services.createStoreBranch(req.body);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all storeBranch 
export const getAllStoreBranches = async (req, res) => {
    try {
        const response = await services.getAllStoreBranches();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Update admin route
export const updateStoreBranch = async (req, res) => {
    try {
        const response = await services.updateStoreBranch(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Delete storeBranch -- admin
export const deleteStoreBranch = async (req, res) => {
    try {
        const response = await services.deleteStoreBranch(req.params);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};
