const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

// CreateColor Admin route 
export const createColor = async (req, res) => {
    try {
        const response = await services.createColor(req.body);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all color 
export const getAllColors = async (req, res) => {
    try {
        const response = await services.getAllColors();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Update admin route
export const updateColor = async (req, res) => {
    try {
        const response = await services.updateColor(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Delete color -- admin
export const deleteColor = async (req, res) => {
    try {
        const response = await services.deleteColor(req.params);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};
