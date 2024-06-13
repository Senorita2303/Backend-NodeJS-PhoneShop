const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

// Create Voucher Admin route 
export const createVoucher = async (req, res) => {
    try {
        const response = await services.createVoucher(req.body);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all voucher 
export const getAllVouchers = async (req, res) => {
    try {
        const response = await services.getAllVouchers();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Update admin route
export const updateVoucher = async (req, res) => {
    try {
        const response = await services.updateVoucher(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Delete voucher -- admin
export const deleteVoucher = async (req, res) => {
    try {
        const response = await services.deleteVoucher(req.params);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Detils of voucher
export const getVoucherDetails = async (req, res) => {
    try {
        const response = await services.getVoucherDetails(req.params.id);
        return res.status(StatusCodes.OK).json(response);

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

export const checkVoucherApply = async (req, res) => {
    try {
        const response = await services.checkVoucherApply(req);
        return res.status(StatusCodes.OK).json(response);

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};