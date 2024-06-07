const { StatusCodes } = require('http-status-codes')
const services = require("~/services");
// Create productVariant -- admin
export const createProductVariant = async (req, res) => {
    try {
        const fileData = req.files;
        const response = await services.createProductVariant(req.body, fileData);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all productVariant
export const getAllProductVariants = async (req, res) => {
    try {
        const response = await services.getAllProductVariants(req);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all productVariant -- admin
export const getAllProductVariantsAdmin = async (req, res) => {
    try {
        const response = await services.getAllProductVariantsAdmin();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Update productVariant -- admin
export const updateProductVariant = async (req, res) => {
    try {
        const fileData = req.file;
        const response = await services.updateProductVariant(req, fileData);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Delete productVariant -- admin
export const deleteProductVariant = async (req, res) => {
    try {
        const response = await services.deleteProductVariant(req.params.id);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Details of productVariant
export const getProductVariantDetails = async (req, res) => {
    try {
        const response = await services.getProductVariantDetails(req.params.id);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};