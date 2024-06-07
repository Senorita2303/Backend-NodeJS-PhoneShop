const crypto = require('crypto');
const qs = require('qs');
import { format } from 'date-fns';
const db = require("~/models");
import { env } from '~/config/environment';

export const createVnPayOrder = (ipAddress, apiUrl, clientUrl, orderId, orderPayAmount) =>
    new Promise(async (resolve, reject) => {
        try {
            const returnUrl = `${apiUrl}/api/payment/vnpay/callback`;
            const date = new Date();
            const createDate = format(date, 'yyyyMMddHHmmss');
            const txnRef = format(date, 'HHmmss');
            let locale = 'vn';
            if (locale === null || locale === '') {
                locale = 'vn';
            }
            let currCode = 'VND';
            let bankCode = "VNBANK"
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = env.VNPAY_TMN_CODE;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = txnRef;
            vnp_Params['vnp_OrderInfo'] = JSON.stringify({ orderId, clientUrl });
            vnp_Params['vnp_OrderType'] = 'topup';
            vnp_Params['vnp_Amount'] = orderPayAmount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddress;
            vnp_Params['vnp_CreateDate'] = createDate;
            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }
            vnp_Params = sortObject(vnp_Params);
            let signData = qs.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", env.VNPAY_SECRET);
            let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            const paymentUrl = env.VNPAY_URL + '?' + qs.stringify(vnp_Params, { encode: false });
            resolve({
                paymentUrl: paymentUrl,
            });
        } catch (error) {
            reject(error);
        }
    });

export const checkPaymentStatus = (vnpayResponse) =>
    new Promise(async (resolve, reject) => {
        try {
            let vnp_Params = vnpayResponse;
            const secureHash = vnp_Params['vnp_SecureHash'];

            // Xóa các trường không cần thiết
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            // Sắp xếp các trường theo thứ tự
            vnp_Params = sortObject(vnp_Params);

            // Lấy thông tin cấu hình và khóa bí mật từ biến môi trường
            const signData = qs.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac('sha512', env.VNPAY_SECRET);
            const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

            if (secureHash === signed) {
                const amount = vnp_Params['vnp_Amount'];
                const txnRef = vnp_Params['vnp_TxnRef'];
                const { orderId, clientUrl } = JSON.parse(
                    Object.keys(qs.parse(vnp_Params['vnp_OrderInfo']))[0]
                );
                const payDate = vnp_Params['vnp_PayDate']; // yyyyMMddHHmmss
                const bankCode = vnp_Params['vnp_BankCode'];
                const bankTranNo = vnp_Params['vnp_BankTranNo'];
                const cartType = vnp_Params['vnp_CardType'];
                const transactionNo = vnp_Params['vnp_TransactionNo'];

                let isSuccess = false, message = 'Payment failed';

                if (vnp_Params['vnp_TransactionStatus'] === '00') {
                    isSuccess = true;
                    message = 'Payment success';
                }
                resolve({
                    isSuccess: isSuccess,
                    data: {
                        amount, txnRef, orderId, clientUrl,
                        payDate, bankCode, bankTranNo,
                        cartType, transactionNo
                    },
                    message: message,
                });

            } else {
                resolve({
                    isSuccess: false,
                    message: 'Invalid secure hash',
                });

            }
        } catch (error) {
            reject(error);
        }
    });

const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
