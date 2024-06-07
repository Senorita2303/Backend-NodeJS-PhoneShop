const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

// CreateMemory Admin route 
export const createMemory = async (req, res) => {
    try {
        const response = await services.createMemory(req.body);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all memory 
export const getAllMemories = async (req, res) => {
    try {
        const response = await services.getAllMemories();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Update admin route
export const updateMemory = async (req, res) => {
    try {
        const response = await services.updateMemory(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Delete memory -- admin
export const deleteMemory = async (req, res) => {
    try {
        const response = await services.deleteMemory(req.params);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};
