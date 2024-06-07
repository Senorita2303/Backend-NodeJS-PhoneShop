const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

// CreateSpecification Admin route 
export const createSpecification = async (req, res) => {
    try {
        const response = await services.createSpecification(req.body);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all specification 
export const getAllSpecifications = async (req, res) => {
    try {
        const response = await services.getAllSpecifications();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Update admin route
export const updateSpecification = async (req, res) => {
    try {
        const response = await services.updateSpecification(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Delete specification -- admin
export const deleteSpecification = async (req, res) => {
    try {
        const response = await services.deleteSpecification(req.params);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};
