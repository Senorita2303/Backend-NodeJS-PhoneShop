// import { env } from '~/config/environment';
// const { StatusCodes } = require('http-status-codes')
// const services = require("~/services");

// export const createPayment = async (req, res) => {
//     try {
//         const response = await services.createPayment(req);
//         return res.status(StatusCodes.OK).json(response);
//     } catch (error) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//             message: "Lỗi server",
//             status: StatusCodes.BAD_REQUEST
//         })
//     }
// };

// export const returnPayment = async (req, res) => {
//     try {
//         const response = await services.returnPayment(req);
//         return res.status(StatusCodes.OK).json(response);
//     } catch (error) {
//         return res.status(StatusCodes.BAD_REQUEST).json({
//             message: "Lỗi server",
//             status: StatusCodes.BAD_REQUEST
//         })
//     }
// }
