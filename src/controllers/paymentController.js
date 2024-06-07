// const { StatusCodes } = require('http-status-codes')
// const services = require("~/services");

// export const createPayment = async (req, res) => {
//   try {
//     const response = await services.createPayment(req.body);
//     return res.status(StatusCodes.OK).json(response);
//   } catch (error) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       message: "Lỗi server",
//       status: StatusCodes.BAD_REQUEST
//     })
//   }
// };

// export const returnPayment = async (req, res) => {
//   try {
//     const response = await services.returnPayment(req);
//     return res.status(StatusCodes.OK).json(response);
//   } catch (error) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       message: "Lỗi server",
//       status: StatusCodes.BAD_REQUEST
//     })
//   }
// }
const CryptoJS = require('crypto-js');
const services = require("~/services");
const db = require("~/models");
const { StatusCodes } = require('http-status-codes')
import { env } from '~/config/environment';
export const getVnpayResult = async (req, res) => {
    try {
        const result = await services.checkPaymentStatus(req.query);
        let message = '';

        if (result.isSuccess) {
            const paidDate = new Date(
                Number.parseInt(result.data.payDate.substring(0, 4)),
                Number.parseInt(result.data.payDate.substring(4, 6)) - 1,
                Number.parseInt(result.data.payDate.substring(6, 8)),
                Number.parseInt(result.data.payDate.substring(8, 10)),
                Number.parseInt(result.data.payDate.substring(10, 12)),
                Number.parseInt(result.data.payDate.substring(12, 14))
            );
            let order = await db.Order.findOne({
                attributes: ['id', 'paymentId'],
                where: {
                    id: result.data.orderId,
                },
                raw: false,
            });
            let payment = await db.Payment.findOne({
                attributes: ['id', 'desc', 'paidDate', 'paymentMethodId', 'paymentStatusId'],
                where: {
                    id: order.paymentId,
                },
                raw: false,
            });
            payment.paidDate = paidDate;
            payment.paymentStatusId = 4;
            payment.desc = `Mã giao dịch VNPAY: ${result.data.transactionNo}. Số tiền: ${result.data.amount}. Mã Ngân hàng thanh toán: ${result.data.bankCode}. Mã giao dịch tại Ngân hàng: ${result.data.bankTranNo}. Loại tài khoản/thẻ khách hàng sử dụng: ${result.data.cardType}`;
            await payment.save();
            message = 'Thanh toán thành công';
        } else {
            let order = await db.Order.findOne({
                attributes: ['id', 'paymentId'],
                where: {
                    id: result.data.orderId,
                },
                raw: false,
            });
            let payment = await db.Payment.findOne({
                attributes: ['id', 'desc', 'paidDate', 'paymentMethodId', 'paymentStatusId'],
                where: {
                    id: order.paymentId,
                },
                raw: false,
            });
            payment.paymentStatusId = 10;
            await payment.save();
            message = 'Thanh toán thất bại';
        }
        // close window
        res.redirect(`${result.data.clientUrl}/order-success/${result.data.orderId}`);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

export const getZalopayResult = async (req, res) => {
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;
        let mac = CryptoJS.HmacSHA256(dataStr, env.ZALO_KEY2).toString();
        let data = JSON.parse(dataStr);
        let orderId = parseInt(data.app_trans_id.split('_')[1]);

        // console.log('mac =', mac);
        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            let order = await db.Order.findOne({
                attributes: ['id', 'paymentId'],
                where: {
                    id: orderId,
                },
                raw: false,
            });
            let payment = await db.Payment.findOne({
                attributes: ['id', 'desc', 'paidDate', 'paymentMethodId', 'paymentStatusId'],
                where: {
                    id: order.paymentId,
                },
                raw: false,
            });
            payment.paymentStatusId = 10;
            await payment.save();
            // callback không hợp lệ
        } else {
            const paidDate = new Date(data.server_time);
            let order = await db.Order.findOne({
                attributes: ['id', 'paymentId'],
                where: {
                    id: orderId,
                },
                raw: false,
            });
            let payment = await db.Payment.findOne({
                attributes: ['id', 'desc', 'paidDate', 'paymentMethodId', 'paymentStatusId'],
                where: {
                    id: order.paymentId,
                },
                raw: false,
            });
            payment.paidDate = paidDate;
            payment.paymentStatusId = 4;
            let method = "";
            if (data.channel === 36) {
                method = "Visa/Master/JCB";
            } else if (data.channel === 37) {
                method = "Bank Account";
            } else if (data.channel === 38) {
                method = "ZaloPay Wallet";
            } else if (data.channel === 39) {
                method = "ATM";
            } else {
                method = "Visa/Master Debit";
            }
            payment.desc = `Mã giao dịch ZALOPAY: ${data.zp_trans_id}. Số tiền: ${data.amount}. Loại thanh toán khách hàng sử dụng: ${method}`;
            await payment.save();
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng ở đây
        }
        return res.status(StatusCodes.OK)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST,
        })
    }
};