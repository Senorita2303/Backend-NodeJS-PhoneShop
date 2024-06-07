const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

export const addProductToCart = async (req, res) => {
    try {
        const response = await services.addProductToCart(req);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

export const updateItemQuantity = async (req, res) => {
    try {
        const response = await services.updateItemQuantity(req.body);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

export const deleteItem = async (req, res) => {
    try {
        const response = await services.deleteItem(req.params);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// export const cleanCart = async (req, res, next) => {
//     try {
//         const userId = req.user._id;
//         const cleaned = await cartService.cleanCart(userId);

//         if (cleaned) {
//             ResponseUtils.status200(res, 'Clean list successfully');
//         } else {
//             ResponseUtils.status200(res, 'Clean list not successfully');
//         }
//     } catch (err) { next(err); }
// }